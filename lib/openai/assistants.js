/** Open AI Config **/
import OpenAI from 'openai';
import {writeDebugLog, writeLog} from "../utils/logging";
import * as JsSearch from "js-search";
import {getOpenAiFile, listOpenAiFilesWithAssistantsPurpose} from "./files";

const openai = new OpenAI();

/**
 * Lists all assistants
 * @param params
 * @return {Promise<*>}
 */
export async function listOpenAiAssistants(params = {}) {
    try {
        const args = {
            order: params.order || "desc", limit: params.limit || "20",
        };

        writeDebugLog("Args:", args)
        const request = await openai.beta.assistants.list(args);
        const assistants = request.data;
        writeDebugLog("Listed Assistants: ", assistants)

        return assistants
    } catch (e) {
        writeLog("Listing Assistants", e);
    }
}

/**
 *
 * @param params
 * @return {Promise<{headers: {"Content-Type": string}, body: string, statusCode: number}|Assistant>}
 */
export async function createOpenAiAssistant(params = {}) {
    try {
        const model = params.model || process.env.OPENAI_ASSISTANT_MODEL || null;
        const name = params.name || null;

        let args = {
            model: model, name: name
        };

        if (params.description) args['description'] = params.description;
        if (params.instructions) args['instructions'] = params.instructions;
        if (params.tools) args['tools'] = params.tools;
        if (params.file_ids) args['file_ids'] = params.file_ids;
        if (params.metadata) args['metadata'] = params.metadata;

        writeDebugLog("Args:", args)
        const request = await openai.beta.assistants.create(args);
        writeDebugLog("Request:", request);

        return request;
    } catch (e) {
        writeLog("Creating Assistant", e)
    }
}

/**
 *
 * @param params
 * @return {Promise<{headers: {"Content-Type": string}, body, statusCode: number}|{headers: {"Content-Type": string}, body: string, statusCode: number}|null>}
 */
export async function getOpenAiAssistant(params = {}) {
    try {

        const name = params.name || null;
        const assistant_id = params.id || params.assistant_id || "";

        let search = new JsSearch.Search('id');
        search.addIndex('name');
        search.addDocuments(await listOpenAiAssistants());

        let assistant;
        writeDebugLog("Search Criteria: ", search);
        if (name) {
            assistant = search.search(name);
        } else {
            assistant = search.search(assistant_id);
        }
        writeDebugLog("Assistant:", assistant)

        if (!assistant.length) return null;

        if (assistant) {
            assistant = assistant[0];
            if (params.fuzzy) return assistant;
            if (assistant.id === assistant_id) return assistant;
            if (assistant.name === name) return assistant;
        }

        return null;

    } catch (e) {
        writeLog("Retrieving Assistant", e)
    }
}

/**
 *
 * @param params
 * @return {Promise<*|AssistantDeleted|null>}
 */
export async function deleteOpenAiAssistant(params = {}) {
    const response = params.default || null;
    try {
        const assistantId = params.id || params.assistant_id || null;
        if (assistantId) return await openai.beta.assistants.del(assistantId);

        const name = params.name || null;
        if (!name) return response;

        let search = new JsSearch.Search('id');
        search.addIndex('name');
        search.addDocuments(await listOpenAiAssistants());

        let assistant;
        if (name) {
            assistant = search.search(name);
        } else {
            assistant = search.search(assistantId);
        }
        writeDebugLog("Assistant:", assistant)

        if (!assistant.length) return response;

        if (assistant) {
            assistant = assistant[0];
            if (assistant.name === name) return await openai.beta.assistants.del(assistant.id);
        }

        return response;

    } catch (e) {
        writeLog("Deleting Assistant", e)
    }
}

/**
 *
 * @param params
 * @return {Promise<{headers: {"Content-Type": string}, body: string, statusCode: number}|Assistant>}
 */
export async function updateOpenAiAssistant(params = {}) {
    try {

        const fileIds = params.file_ids;

        let args = {};
        if (params.name) args['name'] = params.name;
        if (params.model) args['model'] = params.model;
        if (params.description) args['description'] = params.description;
        if (params.instructions) args['instructions'] = params.instructions;
        if (params.tools) args['tools'] = params.tools;
        if (fileIds.length) {

            let search = new JsSearch.Search('id');
            search.addDocuments(await listOpenAiFilesWithAssistantsPurpose());

            let newIds = fileIds;
            for (const fileId of fileIds) {
                const result = search.search(fileId);
                writeLog(result);
                if (result.length) continue;
                newIds = newIds.filter(item => item !== fileId);
                await deleteOpenAiAssistantFile({assistant_id: params.id, file_id: fileId})
            }

            args['file_ids'] = newIds;
        }
        if (params.metadata) args['metadata'] = params.metadata;

        writeDebugLog("Args:", args)
        const request = await openai.beta.assistants.update(params.id, args);
        writeDebugLog("Request:", request);

        return request;
    } catch (e) {
        writeLog("Creating Assistant", e)
    }
}

/**
 *
 * @param params
 * @return {Promise<AssistantFile|null>}
 */
export async function createOpenAiAssistantFile(params = {}) {
    try {
        const assistantId = params.assistant_id || null;
        const fileId = params.file_id || null;
        if (!assistantId || !fileId) return null;

        let response = await openai.beta.assistants.files.create(assistantId, {"file_id": fileId});
        writeDebugLog("Response:", response);

        return response;
    } catch (e) {
        writeLog("Creating Assistant's File", e)
    }
}

/**
 *
 * @param params
 * @return {Promise<FileObject|null>}
 */
export async function getOpenAiAssistantFile(params = {}) {

    const assistantId = params.assistant_id || null;
    const fileId = params.file_id || null;

    try {
        if (!assistantId || !fileId) return null;

        const assistantFile = await openai.beta.assistants.files.retrieve(assistantId, fileId);
        if (!assistantFile) return null;

        return await getOpenAiFile({id: assistantFile.file_id});

    } catch (e) {
        writeLog("Retrieving File for assistant '" + assistantId + "' and file '" + fileId + '"', e)
    }
}

/**
 *
 * @param params
 * @return {Promise<*[]>}
 */
export async function getOpenAiAssistantFiles(params = {}) {
    try {

        const assistantId = params.id;
        if (!assistantId) return [];

        const order = params.order || "desc";
        let args = {
            order: order
        };
        if (params.before) args['cursor'] = params.before;
        if (params.after) args['cursor'] = params.after;

        let response = await openai.beta.assistants.files.list(assistantId, args);
        let hasMore = response.has_more || false;
        if (params.before || params.after || !hasMore) return response.data;
        let after = null;

        let allFiles = [];
        allFiles = allFiles.concat(response.data);

        while (hasMore) {
            let args = {
                order: order
            };
            if (after) args['after'] = after
            const response = await openai.beta.assistants.files.list(assistantId, args);

            const files = response.data || [];
            allFiles = allFiles.concat(files);

            hasMore = response.has_more;
            after = response.last_id;
        }

        return allFiles;

    } catch (e) {
        writeLog("Retrieving Assistant's files", e)
    }
}

/**
 *
 * @param params
 * @return {Promise<FileDeleteResponse|null>}
 */
export async function deleteOpenAiAssistantFile(params = {}) {
    try {
        const assistantId = params.assistant_id || null;
        const fileId = params.file_id || null;
        if (!assistantId) return null;

        return await openai.beta.assistants.files.del(assistantId, fileId);

    } catch (e) {
        writeLog("Deleting File for assistant '" + assistantId + "' and file '" + fileId + '"', e)
    }
}
