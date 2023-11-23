/** Imports **/
import {writeDebugLog, writeLog} from "../utils/logging";
import * as JsSearch from "js-search";

/** Open AI Config **/
import OpenAI, {toFile} from 'openai';

const openai = new OpenAI();

/**
 * Lists all files
 * @param params
 * @return {Promise<FileObject>}
 */
export async function uploadOpenAiFile(params = {
    allow_duplicate: false
}) {

    try {
        const purpose = params.purpose || 'assistants';
        const replace = params.replace || true;
        const allowDuplicate = params.allow_duplicate || false;

        const name = params.name || params.file.name || "";
        const fileObject = await toFile(params.file, name)
        let args = {
            file: fileObject, purpose: purpose
        }

        if (allowDuplicate) return await openai.files.create(args);

        // If we're replacing, let's get the pre-existing file names
        let matchingFiles;
        matchingFiles = await openai.files.list({"purpose": purpose});

        let search = new JsSearch.Search('id');
        search.addIndex('filename');
        search.addDocuments(matchingFiles.data);
        writeDebugLog("File to delete pre-search", search);

        matchingFiles = search.search(name);
        if (matchingFiles.length === 0) return await openai.files.create(args);
        if (!replace) return matchingFiles[0];

        writeDebugLog("Files to delete:", matchingFiles);
        let deletedFiles = [];
        for (const matchingFile of matchingFiles) {
            const deleteFile = await deleteOpenAiFile(matchingFile.id);
            deletedFiles.push(deleteFile);
        }
        writeDebugLog("Deleted files:", deletedFiles);

        return await openai.files.create(args);
    } catch (e) {
        writeLog("Uploading File", e);
        throw(e);
    }
}

/**
 *
 * @param params
 * @return {Promise<FileObject>}
 */
export async function getOpenAiFile(params = {}) {

    const fileId = params.id || params.file_id || null;

    try {
        let request = await openai.files.retrieve(fileId);
        request.content = await openai.files.content(fileId);

        return request;

    } catch (e) {
        writeLog("Retrieving File", e);
    }
}

/**
 *
 * @param fileId
 * @return {Promise<FileDeleted>}
 */
export async function deleteOpenAiFile(fileId) {
    if (!fileId) return null;

    try {
        writeDebugLog("Deleting file:", fileId);
        return await openai.files.del(fileId);

    } catch (e) {
        writeLog("Deleting File", e);
    }
}

/**
 *
 * @param params
 * @return {Promise<Array<FileObject>>}
 */
export async function listOpenAiFiles(params = {}) {

    const purpose = params.purpose || null;

    try {
        const request = await openai.files.list(params);
        writeDebugLog("Request:", request)

        return request.data
    } catch (e) {
        writeLog("Listing Files " + (purpose ? " with '" + purpose + "' purpose" : ""), e);
    }
}

/**
 *
 * @return {Promise<*>}
 */
export async function listOpenAiFilesWithAssistantsOutputPurpose() {
    try {
        const request = await openai.files.list({"purpose": "assistants_output"})
        writeDebugLog("Request:", request)

        return request.data

    } catch (e) {
        writeLog("Listing Files with 'assistants_output' purpose", e);
    }
}

/**
 *
 * @return {Promise<*>}
 */
export async function listOpenAiFilesWithAssistantsPurpose() {
    try {
        const request = await openai.files.list({"purpose": "assistants"})
        writeDebugLog("Request:", request)

        return request.data

    } catch (e) {
        writeLog("Listing Files with 'assistant' purpose", e);
    }
}

/**
 *
 * @return {Promise<*>}
 */
export async function listOpenAiFilesWithFineTunePurpose() {
    try {
        const request = await openai.files.list({"purpose": "fine-tune"})
        writeDebugLog("Request:", request)

        return request.data

    } catch (e) {
        writeLog("Listing Files with 'fine-tune' purpose", e);
    }
}

/**
 *
 * @return {Promise<*>}
 */
export async function listOpenAiFilesWithFineTuneResultsPurpose() {
    try {
        const request = await openai.files.list({"purpose": "fine-tune-results"})
        writeDebugLog("Request:", request)

        return request.data

    } catch (e) {
        writeLog("Listing Files with 'fine-tune-results' purpose", e);
    }
}
