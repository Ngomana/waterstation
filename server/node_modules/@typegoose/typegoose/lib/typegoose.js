"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDiscriminatorModelForClass = exports.deleteModelWithClass = exports.deleteModel = exports.addModelToTypegoose = exports.buildSchema = exports.getModelWithString = exports.getModelForClass = exports.setGlobalOptions = exports.mongoose = void 0;
const tslib_1 = require("tslib");
/* imports */
const mongoose = require("mongoose");
exports.mongoose = mongoose;
require("reflect-metadata");
const semver = require("semver");
const utils_1 = require("./internal/utils");
/* istanbul ignore next */
if (!utils_1.isNullOrUndefined(process === null || process === void 0 ? void 0 : process.version) && !utils_1.isNullOrUndefined(mongoose === null || mongoose === void 0 ? void 0 : mongoose.version)) { // for usage on client side
    /* istanbul ignore next */
    if (semver.lt(mongoose === null || mongoose === void 0 ? void 0 : mongoose.version, '5.10.0')) {
        throw new Error(`Please use mongoose 5.10.0 or higher (Current mongoose: ${mongoose.version}) [E001]`);
    }
    /* istanbul ignore next */
    if (semver.lt(process.version.slice(1), '10.15.0')) {
        throw new Error('You are using a NodeJS Version below 10.15.0, Please Upgrade! [E002]');
    }
    /* istanbul ignore next */
    if (semver.gt(mongoose === null || mongoose === void 0 ? void 0 : mongoose.version, '5.10.18')) {
        console.warn(`Using Unsupported mongoose version, highest supported is 5.10.18 (Current version: ${mongoose.version})`);
    }
}
const globalOptions_1 = require("./globalOptions");
Object.defineProperty(exports, "setGlobalOptions", { enumerable: true, get: function () { return globalOptions_1.setGlobalOptions; } });
const constants_1 = require("./internal/constants");
const data_1 = require("./internal/data");
const schema_1 = require("./internal/schema");
const logSettings_1 = require("./logSettings");
const typeguards_1 = require("./typeguards");
var logSettings_2 = require("./logSettings");
Object.defineProperty(exports, "setLogLevel", { enumerable: true, get: function () { return logSettings_2.setLogLevel; } });
Object.defineProperty(exports, "LogLevels", { enumerable: true, get: function () { return logSettings_2.LogLevels; } });
tslib_1.__exportStar(require("./prop"), exports);
tslib_1.__exportStar(require("./hooks"), exports);
tslib_1.__exportStar(require("./plugin"), exports);
tslib_1.__exportStar(require("./index"), exports);
tslib_1.__exportStar(require("./modelOptions"), exports);
tslib_1.__exportStar(require("./queryMethod"), exports);
tslib_1.__exportStar(require("./typeguards"), exports);
exports.defaultClasses = require("./defaultClasses");
exports.errors = require("./internal/errors");
exports.types = require("./types");
var utils_2 = require("./internal/utils");
Object.defineProperty(exports, "getClassForDocument", { enumerable: true, get: function () { return utils_2.getClassForDocument; } });
Object.defineProperty(exports, "getClass", { enumerable: true, get: function () { return utils_2.getClass; } });
Object.defineProperty(exports, "getName", { enumerable: true, get: function () { return utils_2.getName; } });
var constants_2 = require("./internal/constants");
Object.defineProperty(exports, "Severity", { enumerable: true, get: function () { return constants_2.Severity; } });
globalOptions_1.parseENV(); // call this before anything to ensure they are applied
/**
 * Get a Model for a Class
 * Executes .setModelForClass if it can't find it already
 * @param cl The uninitialized Class
 * @returns The Model
 * @public
 * @example
 * ```ts
 * class Name {}
 *
 * const NameModel = getModelForClass(Name);
 * ```
 */
function getModelForClass(cl, options) {
    var _a, _b, _c, _d, _e, _f;
    utils_1.assertionIsClass(cl);
    options = typeof options === 'object' ? options : {};
    const roptions = utils_1.mergeMetadata(constants_1.DecoratorKeys.ModelOptions, options, cl);
    const name = utils_1.getName(cl);
    if (data_1.models.has(name)) {
        return data_1.models.get(name);
    }
    const model = (_d = (_b = (_a = roptions === null || roptions === void 0 ? void 0 : roptions.existingConnection) === null || _a === void 0 ? void 0 : _a.model.bind(roptions.existingConnection)) !== null && _b !== void 0 ? _b : (_c = roptions === null || roptions === void 0 ? void 0 : roptions.existingMongoose) === null || _c === void 0 ? void 0 : _c.model.bind(roptions.existingMongoose)) !== null && _d !== void 0 ? _d : mongoose.model.bind(mongoose);
    const compiledmodel = model(name, buildSchema(cl, roptions.schemaOptions));
    const refetchedOptions = (_e = Reflect.getMetadata(constants_1.DecoratorKeys.ModelOptions, cl)) !== null && _e !== void 0 ? _e : {};
    if ((_f = refetchedOptions === null || refetchedOptions === void 0 ? void 0 : refetchedOptions.options) === null || _f === void 0 ? void 0 : _f.runSyncIndexes) {
        // no async/await, to wait for execution on connection in the background
        compiledmodel.syncIndexes();
    }
    return addModelToTypegoose(compiledmodel, cl, {
        existingMongoose: roptions === null || roptions === void 0 ? void 0 : roptions.existingMongoose,
        existingConnection: roptions === null || roptions === void 0 ? void 0 : roptions.existingConnection
    });
}
exports.getModelForClass = getModelForClass;
/**
 * Get Model from internal cache
 * @param key ModelName key
 * @example
 * ```ts
 * class Name {}
 * getModelForClass(Name); // build the model
 * const NameModel = getModelWithString<typeof Name>("Name");
 * ```
 */
function getModelWithString(key) {
    utils_1.assertion(typeof key === 'string', TypeError(`Expected "key" to be a string, got "${key}"`));
    return data_1.models.get(key);
}
exports.getModelWithString = getModelWithString;
/**
 * Generates a Mongoose schema out of class props, iterating through all parents
 * @param cl The not initialized Class
 * @returns Returns the Build Schema
 * @example
 * ```ts
 * class Name {}
 * const NameSchema = buildSchema(Name);
 * const NameModel = mongoose.model("Name", NameSchema);
 * ```
 */
function buildSchema(cl, options) {
    utils_1.assertionIsClass(cl);
    logSettings_1.logger.debug('buildSchema called for "%s"', utils_1.getName(cl));
    const mergedOptions = utils_1.mergeSchemaOptions(options, cl);
    let sch;
    /** Parent Constructor */
    let parentCtor = Object.getPrototypeOf(cl.prototype).constructor;
    // iterate trough all parents
    while ((parentCtor === null || parentCtor === void 0 ? void 0 : parentCtor.name) !== 'Object') {
        // extend schema
        sch = schema_1._buildSchema(parentCtor, sch, mergedOptions, false);
        // set next parent
        parentCtor = Object.getPrototypeOf(parentCtor.prototype).constructor;
    }
    // get schema of current model
    sch = schema_1._buildSchema(cl, sch, mergedOptions);
    return sch;
}
exports.buildSchema = buildSchema;
/**
 * This can be used to add custom Models to Typegoose, with the type information of cl
 * Note: no gurantee that the type information is fully correct
 * @param model The model to store
 * @param cl The Class to store
 * @param options? Optional param for existingMongoose or existingConnection
 * @example
 * ```ts
 * class Name {}
 *
 * const schema = buildSchema(Name);
 * // modifications to the schame can be done
 * const model = addModelToTypegoose(mongoose.model("Name", schema), Name);
 * ```
 */
function addModelToTypegoose(model, cl, options) {
    var _a, _b, _c;
    const mongooseModel = ((_a = options === null || options === void 0 ? void 0 : options.existingMongoose) === null || _a === void 0 ? void 0 : _a.Model) || ((_c = (_b = options === null || options === void 0 ? void 0 : options.existingConnection) === null || _b === void 0 ? void 0 : _b.base) === null || _c === void 0 ? void 0 : _c.Model) || mongoose.Model;
    utils_1.assertion(model.prototype instanceof mongooseModel, new TypeError(`"${model}" is not a valid Model!`));
    utils_1.assertionIsClass(cl);
    const name = utils_1.getName(cl);
    utils_1.assertion(!data_1.models.has(name), new Error('It seems like "addModelToTypegoose" got called twice\n' +
        'Or multiple classes with the same name are used, which is not supported!' +
        `(Model Name: "${name}") [E003]`));
    if (data_1.constructors.get(name)) {
        logSettings_1.logger.info('Class "%s" already existed in the constructors Map', name);
    }
    data_1.models.set(name, model);
    data_1.constructors.set(name, cl);
    return data_1.models.get(name);
}
exports.addModelToTypegoose = addModelToTypegoose;
/**
 * Deletes an existing model so that it can be overwritten
 * with another model
 * (deletes from mongoose.connection & typegoose models cache & typegoose constructors cache)
 * @param key
 * @example
 * ```ts
 * class Name {}
 * const NameModel = getModelForClass(Name);
 * deleteModel("Name");
 * ```
 */
function deleteModel(name) {
    utils_1.assertion(typeof name === 'string', new TypeError('name is not an string! (deleteModel)'));
    utils_1.assertion(data_1.models.has(name), new Error(`Model "${name}" could not be found`));
    logSettings_1.logger.debug('Deleting Model "%s"', name);
    data_1.models.get(name).db.deleteModel(name);
    data_1.models.delete(name);
    data_1.constructors.delete(name);
}
exports.deleteModel = deleteModel;
/**
 * Delete a model, with the given class
 * Same as "deleteModel", only that it can be done with the class instead of the name
 * @param cl The Class
 * @example
 * ```ts
 * class Name {}
 * const NameModel = getModelForClass(Name);
 * deleteModelWithClass(Name);
 * ```
 */
function deleteModelWithClass(cl) {
    utils_1.assertionIsClass(cl);
    return deleteModel(utils_1.getName(cl));
}
exports.deleteModelWithClass = deleteModelWithClass;
/**
 * Build a Model from a given class and return the model
 * @param from The Model to build From
 * @param cl The Class to make a model out
 * @param value The Identifier to use to differentiate documents (default: cl.name)
 * @example
 * ```ts
 * class C1 {}
 * class C2 extends C1 {}
 *
 * const C1Model = getModelForClass(C1);
 * const C2Model = getDiscriminatorModelForClass(C1Model, C1);
 * ```
 */
function getDiscriminatorModelForClass(from, cl, value) {
    utils_1.assertion(typeguards_1.isModel(from), new TypeError(`"${from}" is not a valid Model!`));
    utils_1.assertionIsClass(cl);
    const name = utils_1.getName(cl);
    if (data_1.models.has(name)) {
        return data_1.models.get(name);
    }
    const sch = buildSchema(cl);
    const discriminatorKey = sch.get('discriminatorKey');
    if (sch.path(discriminatorKey)) {
        sch.paths[discriminatorKey].options.$skipDiscriminatorCheck = true;
    }
    const model = from.discriminator(name, sch, value ? value : name);
    return addModelToTypegoose(model, cl);
}
exports.getDiscriminatorModelForClass = getDiscriminatorModelForClass;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZWdvb3NlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3R5cGVnb29zZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsYUFBYTtBQUNiLHFDQUFxQztBQXdDNUIsNEJBQVE7QUF2Q2pCLDRCQUEwQjtBQUMxQixpQ0FBaUM7QUFFakMsNENBQThIO0FBRTlILDBCQUEwQjtBQUMxQixJQUFJLENBQUMseUJBQWlCLENBQUMsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMseUJBQWlCLENBQUMsUUFBUSxhQUFSLFFBQVEsdUJBQVIsUUFBUSxDQUFFLE9BQU8sQ0FBQyxFQUFFLEVBQUUsMkJBQTJCO0lBQzlHLDBCQUEwQjtJQUMxQixJQUFJLE1BQU0sQ0FBQyxFQUFFLENBQUMsUUFBUSxhQUFSLFFBQVEsdUJBQVIsUUFBUSxDQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsRUFBRTtRQUMxQyxNQUFNLElBQUksS0FBSyxDQUFDLDJEQUEyRCxRQUFRLENBQUMsT0FBTyxVQUFVLENBQUMsQ0FBQztLQUN4RztJQUVELDBCQUEwQjtJQUMxQixJQUFJLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLEVBQUU7UUFDbEQsTUFBTSxJQUFJLEtBQUssQ0FBQyxzRUFBc0UsQ0FBQyxDQUFDO0tBQ3pGO0lBRUQsMEJBQTBCO0lBQzFCLElBQUksTUFBTSxDQUFDLEVBQUUsQ0FBQyxRQUFRLGFBQVIsUUFBUSx1QkFBUixRQUFRLENBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQyxFQUFFO1FBQzNDLE9BQU8sQ0FBQyxJQUFJLENBQUMsc0ZBQXNGLFFBQVEsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO0tBQ3pIO0NBQ0Y7QUFFRCxtREFBNkQ7QUFnQjFDLGlHQWhCQSxnQ0FBZ0IsT0FnQkE7QUFmbkMsb0RBQXFEO0FBQ3JE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