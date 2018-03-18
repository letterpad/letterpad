module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var chunk = require("./" + "../hot/hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		try {
/******/ 			var update = require("./" + "../hot/hot-update.json");
/******/ 		} catch (e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/
/******/ 	//eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "747aecc246fc51186555"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (!installedModules[request].parents.includes(moduleId))
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (!me.children.includes(request)) me.children.push(request);
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (typeof dep === "undefined") hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (typeof dep === "undefined") hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle")
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			{
/******/ 				// eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.includes(parentId)) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (!a.includes(item)) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted
/******/ 			)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.includes(cb)) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading wasm modules
/******/ 	var installedWasmModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// object with all compiled WebAssembly.Modules
/******/ 	__webpack_require__.w = {};
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./client/Route.js":
/*!*************************!*\
  !*** ./client/Route.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "react");

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "react-router-dom");

var _reactRouter = __webpack_require__(/*! react-router */ "react-router");

var _reactHelmet = __webpack_require__(/*! react-helmet */ "react-helmet");

var _SEO = __webpack_require__(/*! ./components/SEO */ "./client/components/SEO.js");

var _SEO2 = _interopRequireDefault(_SEO);

var _Loader = __webpack_require__(/*! ./components/Loader */ "./client/components/Loader.js");

var _Loader2 = _interopRequireDefault(_Loader);

var _SettingsData = __webpack_require__(/*! ./data-supply/SettingsData */ "./client/data-supply/SettingsData.js");

var _SettingsData2 = _interopRequireDefault(_SettingsData);

var _Home = __webpack_require__(/*! ./containers/Home */ "./client/containers/Home.js");

var _Home2 = _interopRequireDefault(_Home);

var _Posts = __webpack_require__(/*! ./containers/Posts */ "./client/containers/Posts.js");

var _Posts2 = _interopRequireDefault(_Posts);

var _SinglePage = __webpack_require__(/*! ./containers/SinglePage */ "./client/containers/SinglePage.js");

var _SinglePage2 = _interopRequireDefault(_SinglePage);

var _SinglePost = __webpack_require__(/*! ./containers/SinglePost */ "./client/containers/SinglePost.js");

var _SinglePost2 = _interopRequireDefault(_SinglePost);

var _SearchWrapper = __webpack_require__(/*! ./containers/SearchWrapper */ "./client/containers/SearchWrapper.js");

var _SearchWrapper2 = _interopRequireDefault(_SearchWrapper);

var _Layout = __webpack_require__(/*! ./containers/Layout */ "./client/themes/amun/containers/Layout.js");

var _Layout2 = _interopRequireDefault(_Layout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Data supply


/*!------------------------------------------------------------------
[View Containers-]
*/


__webpack_require__(/*! ../public/scss/client.scss */ "./public/scss/client.scss");

var App = function (_Component) {
    _inherits(App, _Component);

    function App(props) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this.applyCustomCSS = _this.applyCustomCSS.bind(_this);
        return _this;
    }

    _createClass(App, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            var bc = new BroadcastChannel("test_channel");
            bc.onmessage = function (params) {
                var _params$data = params.data,
                    property = _params$data.property,
                    color = _params$data.color;

                document.querySelector(":root").style.setProperty(property, color);
            };
        }
    }, {
        key: "applyCustomCSS",
        value: function applyCustomCSS(_ref) {
            var css = _ref.css,
                colors = _ref.colors;

            if (typeof document == "undefined") return false;
            var style = document.createElement("style");
            style.setAttribute("type", "text/css");
            style.innerText = css.value;
            document.head.appendChild(style);
            var parsedColors = JSON.parse(colors.value);
            Object.keys(parsedColors).forEach(function (property) {
                document.querySelector(":root").style.setProperty(property, parsedColors[property]);
            });
        }
    }, {
        key: "render",
        value: function render() {
            if (this.props.settings.loading) {
                return _react2.default.createElement(_Loader2.default, null);
            }
            var settings = this.props.settings.data;
            this.applyCustomCSS(settings);

            var routes = [{
                exact: true,
                component: (0, _Layout2.default)(_Home2.default, { settings: settings }),
                path: "/"
            }, {
                exact: true,
                component: (0, _Layout2.default)(_Posts2.default, { settings: settings }),
                path: "/posts/:slug"
            }, {
                exact: true,
                component: (0, _Layout2.default)(_SinglePage2.default, {
                    settings: settings
                }),
                path: "/page/:slug"
            }, {
                exact: true,
                component: (0, _Layout2.default)(_SinglePost2.default, {
                    settings: settings
                }),
                path: "/post/:slug"
            }, {
                exact: true,
                component: (0, _Layout2.default)(_SearchWrapper2.default, {
                    type: "category",
                    settings: settings
                }),
                path: "/category/:query"
            }, {
                exact: true,
                component: (0, _Layout2.default)(_SearchWrapper2.default, {
                    type: "tag",
                    settings: settings
                }),
                path: "/tag/:query"
            }, {
                exact: true,
                component: (0, _Layout2.default)(_SearchWrapper2.default, {
                    type: "post",
                    settings: settings
                }),
                path: "/search/:query"
            }];

            return _react2.default.createElement(
                "div",
                null,
                _react2.default.createElement(_SEO2.default, {
                    schema: "Blog",
                    title: settings.site_title.value + " | " + settings.site_tagline.value,
                    description: settings.site_description.value,
                    path: "/",
                    image: "/",
                    contentType: "blog",
                    settings: settings
                }),
                _react2.default.createElement(
                    _reactRouterDom.Switch,
                    null,
                    routes.map(function (route, i) {
                        return _react2.default.createElement(_reactRouterDom.Route, {
                            key: i,
                            exact: true,
                            path: route.path,
                            component: route.component
                        });
                    })
                )
            );
        }
    }]);

    return App;
}(_react.Component);

exports.default = (0, _SettingsData2.default)((0, _reactRouter.withRouter)(App));

/***/ }),

/***/ "./client/apolloClient.js":
/*!********************************!*\
  !*** ./client/apolloClient.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _apolloClient = __webpack_require__(/*! apollo-client */ "apollo-client");

var _apolloClient2 = _interopRequireDefault(_apolloClient);

var _apolloLinkHttp = __webpack_require__(/*! apollo-link-http */ "apollo-link-http");

var _apolloLink = __webpack_require__(/*! apollo-link */ "apollo-link");

var _apolloCacheInmemory = __webpack_require__(/*! apollo-cache-inmemory */ "apollo-cache-inmemory");

var _apolloLinkError = __webpack_require__(/*! apollo-link-error */ "apollo-link-error");

var _whatwgFetch = __webpack_require__(/*! whatwg-fetch */ "whatwg-fetch");

var _config = __webpack_require__(/*! ../config */ "./config/index.js");

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var httpLink = (0, _apolloLinkHttp.createHttpLink)({
    uri: _config2.default.apiUrl,
    fetch: _whatwgFetch.fetch
});

var middlewareLink = new _apolloLink.ApolloLink(function (operation, forward) {
    operation.setContext({
        headers: {
            browser: true
        }
    });
    return forward(operation);
});
var errorLink = (0, _apolloLinkError.onError)(function (_ref) {
    var networkError = _ref.networkError;

    if (networkError.statusCode === 401) {
        window.location = "/admin/login";
    }
});
var initialState = {};
if (typeof window !== "undefined") {
    initialState = window.__APOLLO_STATE__;
}

var client = new _apolloClient2.default({
    link: errorLink.concat(middlewareLink).concat(httpLink),
    cache: new _apolloCacheInmemory.InMemoryCache().restore(initialState),
    ssrForceFetchDelay: 100
});

exports.default = client;

/***/ }),

/***/ "./client/components/Loader.js":
/*!*************************************!*\
  !*** ./client/components/Loader.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Loader = function (_Component) {
    _inherits(Loader, _Component);

    function Loader() {
        _classCallCheck(this, Loader);

        return _possibleConstructorReturn(this, (Loader.__proto__ || Object.getPrototypeOf(Loader)).apply(this, arguments));
    }

    _createClass(Loader, [{
        key: "render",
        value: function render() {
            return _react2.default.createElement(
                "div",
                { className: "progress progress-striped active" },
                _react2.default.createElement("div", {
                    className: "progress-bar progress-bar-success",
                    style: { width: "100%" }
                })
            );
        }
    }]);

    return Loader;
}(_react.Component);

exports.default = Loader;

/***/ }),

/***/ "./client/components/Navbar/Dropdown.js":
/*!**********************************************!*\
  !*** ./client/components/Navbar/Dropdown.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__(/*! react */ "react");

var _react2 = _interopRequireDefault(_react);

var _Item = __webpack_require__(/*! ./Item */ "./client/components/Navbar/Item.js");

var _Item2 = _interopRequireDefault(_Item);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Markup = function Markup(_ref) {
    var title = _ref.title,
        items = _ref.items,
        className = _ref.className,
        caret = _ref.caret,
        toggleDropdown = _ref.toggleDropdown,
        isOpen = _ref.isOpen;

    var actions = toggleDropdown ? { onMouseOver: toggleDropdown, onMouseOut: toggleDropdown } : {};
    var classes = isOpen ? className + " open" : className;
    return _react2.default.createElement(
        "li",
        _extends({ className: classes }, actions),
        _react2.default.createElement(
            "a",
            {
                href: "#",
                className: "dropdown-toggle",
                "data-toggle": "dropdown",
                role: "button",
                "aria-haspopup": "true",
                "aria-expanded": "false"
            },
            title,
            caret && _react2.default.createElement("span", { className: "caret" })
        ),
        _react2.default.createElement(
            "ul",
            { className: "dropdown-menu" },
            items
        )
    );
};

var Dropdown = function (_Component) {
    _inherits(Dropdown, _Component);

    function Dropdown(props) {
        _classCallCheck(this, Dropdown);

        var _this = _possibleConstructorReturn(this, (Dropdown.__proto__ || Object.getPrototypeOf(Dropdown)).call(this, props));

        _this.toggleDropdown = _this.toggleDropdown.bind(_this);
        _this.state = {
            open: false
        };
        return _this;
    }

    _createClass(Dropdown, [{
        key: "toggleDropdown",
        value: function toggleDropdown() {
            this.setState({ open: !this.state.open });
        }
    }, {
        key: "render",
        value: function render() {
            var recurssiveDD = function recurssiveDD(children) {
                return children.map(function (item, index) {
                    var ref = "i" + index;
                    if (item.children.length > 0) {
                        return _react2.default.createElement(Markup, {
                            className: "dropdown-submenu",
                            title: item.name,
                            items: recurssiveDD(item.children)
                        });
                    }
                    return _react2.default.createElement(_Item2.default, _extends({}, item, { ref: ref, key: ref }));
                });
            };

            return _react2.default.createElement(Markup, {
                title: this.props.name,
                items: recurssiveDD(this.props.children),
                caret: true,
                isOpen: this.state.open,
                toggleDropdown: this.toggleDropdown
            });
        }
    }]);

    return Dropdown;
}(_react.Component);

exports.default = Dropdown;

/***/ }),

/***/ "./client/components/Navbar/Item.js":
/*!******************************************!*\
  !*** ./client/components/Navbar/Item.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "react");

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "react-router-dom");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Item = function (_Component) {
    _inherits(Item, _Component);

    function Item() {
        _classCallCheck(this, Item);

        return _possibleConstructorReturn(this, (Item.__proto__ || Object.getPrototypeOf(Item)).apply(this, arguments));
    }

    _createClass(Item, [{
        key: "render",
        value: function render() {
            var slug = "";
            if (this.props.type === "page") {
                slug = "/page/" + this.props.slug;
            } else if (this.props.type == "category") {
                slug = "/posts/" + this.props.slug;
            }
            return _react2.default.createElement(
                "li",
                null,
                _react2.default.createElement(
                    _reactRouterDom.Link,
                    { to: slug },
                    this.props.name
                )
            );
        }
    }]);

    return Item;
}(_react.Component);

exports.default = Item;

/***/ }),

/***/ "./client/components/Navbar/MenuHorizontal.js":
/*!****************************************************!*\
  !*** ./client/components/Navbar/MenuHorizontal.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "react");

var _react2 = _interopRequireDefault(_react);

var _MenuItems = __webpack_require__(/*! ./MenuItems */ "./client/components/Navbar/MenuItems.js");

var _MenuItems2 = _interopRequireDefault(_MenuItems);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Menuhorizontal = function (_Component) {
    _inherits(Menuhorizontal, _Component);

    function Menuhorizontal() {
        _classCallCheck(this, Menuhorizontal);

        return _possibleConstructorReturn(this, (Menuhorizontal.__proto__ || Object.getPrototypeOf(Menuhorizontal)).apply(this, arguments));
    }

    _createClass(Menuhorizontal, [{
        key: "render",
        value: function render() {
            return _react2.default.createElement(_MenuItems2.default, {
                ref: "secondaryMenuItems",
                secondary: true,
                items: this.props.items
            });
        }
    }]);

    return Menuhorizontal;
}(_react.Component);

exports.default = Menuhorizontal;

/***/ }),

/***/ "./client/components/Navbar/MenuItems.js":
/*!***********************************************!*\
  !*** ./client/components/Navbar/MenuItems.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "react");

var _react2 = _interopRequireDefault(_react);

var _classnames = __webpack_require__(/*! classnames */ "classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _Dropdown = __webpack_require__(/*! ./Dropdown */ "./client/components/Navbar/Dropdown.js");

var _Dropdown2 = _interopRequireDefault(_Dropdown);

var _Item = __webpack_require__(/*! ./Item */ "./client/components/Navbar/Item.js");

var _Item2 = _interopRequireDefault(_Item);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MenuItems = function (_Component) {
    _inherits(MenuItems, _Component);

    function MenuItems() {
        _classCallCheck(this, MenuItems);

        return _possibleConstructorReturn(this, (MenuItems.__proto__ || Object.getPrototypeOf(MenuItems)).apply(this, arguments));
    }

    _createClass(MenuItems, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            var className = (0, _classnames2.default)("nav navbar-nav", {
                "navbar-right": this.props.secondary
            });

            var items = this.props.items.map(function (item, index) {
                return _this2.itemElement(item, "i" + index);
            });

            return _react2.default.createElement(
                "ul",
                { className: className },
                items
            );
        }
    }, {
        key: "itemElement",
        value: function itemElement(item, ref) {
            return item.children.length > 0 ? _react2.default.createElement(_Dropdown2.default, _extends({}, item, { ref: ref, key: ref })) : _react2.default.createElement(_Item2.default, _extends({}, item, { ref: ref, key: ref }));
        }
    }]);

    return MenuItems;
}(_react.Component);

exports.default = MenuItems;

/***/ }),

/***/ "./client/components/Navbar/MenuTree.js":
/*!**********************************************!*\
  !*** ./client/components/Navbar/MenuTree.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(/*! prop-types */ "prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "react-router-dom");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MenuTree = function (_Component) {
    _inherits(MenuTree, _Component);

    function MenuTree(props) {
        _classCallCheck(this, MenuTree);

        var _this = _possibleConstructorReturn(this, (MenuTree.__proto__ || Object.getPrototypeOf(MenuTree)).call(this, props));

        _this.onSelect = _this.onSelect.bind(_this);
        _this.state = {
            data: _this.props.data,
            permissions: _this.props.permissions,
            route: _this.props.route
        };
        return _this;
    }

    _createClass(MenuTree, [{
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(nextProps) {
            this.setState({ data: nextProps.data });
        }
    }, {
        key: "onSelect",
        value: function onSelect(data) {
            var newData = this.props.data.map(function (item) {
                if (item.label === data.label && item.name === data.name) {
                    return data;
                }
                return item;
            });
            this.props.setData(newData);
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            var tree = this.state.data.map(function (child) {
                return _react2.default.createElement(TreeNode, {
                    permissions: _this2.state.permissions,
                    key: child.id,
                    data: child,
                    route: _this2.state.route,
                    setSelection: _this2.onSelect
                });
            });

            return _react2.default.createElement(
                "ul",
                { className: "nav nav-list" },
                tree
            );
        }
    }]);

    return MenuTree;
}(_react.Component);

exports.default = MenuTree;


MenuTree.propTypes = {
    data: _propTypes2.default.array,
    permissions: _propTypes2.default.array,
    route: _propTypes2.default.string,
    setData: _propTypes2.default.func
};

var TreeNode = function (_Component2) {
    _inherits(TreeNode, _Component2);

    function TreeNode(props) {
        _classCallCheck(this, TreeNode);

        var _this3 = _possibleConstructorReturn(this, (TreeNode.__proto__ || Object.getPrototypeOf(TreeNode)).call(this, props));

        _this3.state = { collapsed: true, selected: "" };
        _this3.onClick = _this3.onClick.bind(_this3);
        return _this3;
    }

    _createClass(TreeNode, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            var newState = {};
            if ("collapsed" in this.props.data && !this.props.data.collapsed) {
                newState.collapsed = this.props.data.collapsed;
            }
            var slug = "";
            if (this.props.data.type === "page") {
                slug = "/page/" + this.props.data.slug;
            } else if (this.props.data.type == "category") {
                slug = "/posts/" + this.props.data.slug;
            }
            newState.selected = slug === this.props.route ? "active" : "";
            this.setState(newState);
        }
    }, {
        key: "onClick",
        value: function onClick(e) {
            e.preventDefault();
            this.setState({
                collapsed: !this.state.collapsed
            });
            this.props.data.collapsed = !this.state.collapsed;
            this.props.setSelection(this.props.data);
        }
    }, {
        key: "render",
        value: function render() {
            var _this4 = this;

            var subtree = null;
            if (this.props.data.children.length > 0) {
                subtree = this.props.data.children.sort(function (a, b) {
                    return a.priority - b.priority;
                }).map(function (child) {
                    return _react2.default.createElement(TreeNode, {
                        permissions: _this4.props.permissions,
                        key: child.id,
                        data: child,
                        route: _this4.props.route,
                        setSelection: _this4.props.setSelection
                    });
                });
            }

            var containerClassName = "collapse in";
            var linkclass = "accordian-heading";
            var treeState = "open";
            if (this.state.collapsed) {
                linkclass += " collapsed";
                treeState = "";
                containerClassName = " collapse";
            }

            if (subtree) {
                return _react2.default.createElement(
                    "li",
                    { className: "has-sub " + treeState },
                    _react2.default.createElement(
                        _reactRouterDom.Link,
                        {
                            to: "#",
                            className: linkclass,
                            onClick: this.onClick,
                            "data-id": this.props.data.id
                        },
                        _react2.default.createElement(
                            "span",
                            null,
                            this.props.data.name
                        )
                    ),
                    _react2.default.createElement(
                        "ul",
                        { className: containerClassName + " nav nav-list" },
                        subtree
                    )
                );
            }
            var to = "/";
            if (this.props.data.type == "page") {
                to = "/page/" + this.props.data.slug;
            } else {
                to = "/posts/" + this.props.data.slug;
            }
            return _react2.default.createElement(
                "li",
                { className: "tree-node-leaf " + this.state.selected },
                _react2.default.createElement(
                    _reactRouterDom.Link,
                    { "data-id": this.props.data.id, to: to },
                    this.props.data.icon && _react2.default.createElement("i", { className: "menu-icon fa " + this.props.data.icon }),
                    _react2.default.createElement(
                        "span",
                        null,
                        this.props.data.name
                    )
                )
            );
        }
    }]);

    return TreeNode;
}(_react.Component);

TreeNode.propTypes = {
    setSelection: _propTypes2.default.func,
    data: _propTypes2.default.object,
    permissions: _propTypes2.default.array,
    route: _propTypes2.default.string
};

/***/ }),

/***/ "./client/components/Navbar/MenuVertical.js":
/*!**************************************************!*\
  !*** ./client/components/Navbar/MenuVertical.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "react");

var _react2 = _interopRequireDefault(_react);

var _MenuTree = __webpack_require__(/*! ./MenuTree */ "./client/components/Navbar/MenuTree.js");

var _MenuTree2 = _interopRequireDefault(_MenuTree);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var menuStore = [];

var Menu = function (_Component) {
    _inherits(Menu, _Component);

    function Menu(props) {
        _classCallCheck(this, Menu);

        var _this = _possibleConstructorReturn(this, (Menu.__proto__ || Object.getPrototypeOf(Menu)).call(this, props));

        _this.setData = _this.setData.bind(_this);
        _this.state = {
            menu: []
        };
        return _this;
    }

    _createClass(Menu, [{
        key: "componentWillMount",
        value: function componentWillMount() {
            if (menuStore.length === 0) {
                menuStore = this.props.menu;
            }
            this.setState({ menu: menuStore });
        }
    }, {
        key: "setData",
        value: function setData(newData) {
            menuStore = newData;
            this.setState({ menu: newData });
        }
    }, {
        key: "render",
        value: function render() {
            return _react2.default.createElement(_MenuTree2.default, {
                data: this.state.menu,
                permissions: [],
                route: this.props.router.location.pathname,
                setData: this.setData
            });
        }
    }]);

    return Menu;
}(_react.Component);

exports.default = Menu;

/***/ }),

/***/ "./client/components/Navbar/index.js":
/*!*******************************************!*\
  !*** ./client/components/Navbar/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "react");

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "react-router-dom");

var _MenuVertical = __webpack_require__(/*! ./MenuVertical */ "./client/components/Navbar/MenuVertical.js");

var _MenuVertical2 = _interopRequireDefault(_MenuVertical);

var _MenuHorizontal = __webpack_require__(/*! ./MenuHorizontal */ "./client/components/Navbar/MenuHorizontal.js");

var _MenuHorizontal2 = _interopRequireDefault(_MenuHorizontal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Navbar = function (_Component) {
    _inherits(Navbar, _Component);

    function Navbar(props) {
        _classCallCheck(this, Navbar);

        var _this = _possibleConstructorReturn(this, (Navbar.__proto__ || Object.getPrototypeOf(Navbar)).call(this, props));

        _this.state = {
            navbarOpen: false
        };
        return _this;
    }

    _createClass(Navbar, [{
        key: "navbarToggle",
        value: function navbarToggle() {
            this.setState({ navbarOpen: !this.state.navbarOpen });
        }
    }, {
        key: "render",
        value: function render() {
            var navbarStatus = this.state.navbarOpen ? "in" : "";

            return _react2.default.createElement(
                "div",
                null,
                _react2.default.createElement(
                    "div",
                    { className: "navbar-header" },
                    _react2.default.createElement(
                        "button",
                        {
                            type: "button",
                            className: "navbar-toggle collapsed",
                            "data-toggle": "collapse",
                            "data-target": "#custom-collapse",
                            "aria-expanded": "false"
                        },
                        _react2.default.createElement(
                            "span",
                            { className: "sr-only" },
                            "Toggle navigation"
                        ),
                        _react2.default.createElement("span", { className: "icon-bar" }),
                        _react2.default.createElement("span", { className: "icon-bar" }),
                        _react2.default.createElement("span", { className: "icon-bar" })
                    ),
                    _react2.default.createElement(
                        _reactRouterDom.Link,
                        { className: "navbar-brand brand", to: "/" },
                        this.props.settings.site_title.value
                    )
                ),
                _react2.default.createElement(
                    "div",
                    {
                        className: "collapse navbar-collapse " + navbarStatus,
                        id: "custom-collapse"
                    },
                    this.props.position == "left" ? _react2.default.createElement(_MenuVertical2.default, {
                        menu: JSON.parse(this.props.settings.menu.value),
                        router: this.props.router
                    }) : _react2.default.createElement(_MenuHorizontal2.default, {
                        ref: "secondaryMenuItems",
                        secondary: true,
                        items: JSON.parse(this.props.settings.menu.value),
                        router: this.props.router
                    })
                )
            );
        }
    }]);

    return Navbar;
}(_react.Component);

exports.default = Navbar;

/***/ }),

/***/ "./client/components/OhSnap.js":
/*!*************************************!*\
  !*** ./client/components/OhSnap.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(/*! react */ "react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OhSnap = function OhSnap(_ref) {
    var message = _ref.message;

    return _react2.default.createElement(
        "section",
        { className: "card" },
        _react2.default.createElement(
            "div",
            { className: "row" },
            _react2.default.createElement(
                "div",
                { className: "card" },
                _react2.default.createElement(
                    "div",
                    { className: "module-title" },
                    "Oh Snap!"
                ),
                _react2.default.createElement(
                    "div",
                    { className: "module-subtitle" },
                    message
                )
            )
        )
    );
};

exports.default = OhSnap;

/***/ }),

/***/ "./client/components/Paginate.js":
/*!***************************************!*\
  !*** ./client/components/Paginate.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(/*! react */ "react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(/*! prop-types */ "prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "react-router-dom");

var _config = __webpack_require__(/*! ../../config */ "./config/index.js");

var _config2 = _interopRequireDefault(_config);

var _reactInfiniteScroller = __webpack_require__(/*! react-infinite-scroller */ "react-infinite-scroller");

var _reactInfiniteScroller2 = _interopRequireDefault(_reactInfiniteScroller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Paginate = function Paginate(_ref) {
    var data = _ref.data,
        count = _ref.count,
        page = _ref.page,
        loadMore = _ref.loadMore;

    var limit = _config2.default.itemsPerPage;
    var pages = Array.from(Array(Math.ceil(count / limit)));

    return _react2.default.createElement(
        _reactInfiniteScroller2.default,
        {
            pageStart: 1,
            loadMore: loadMore,
            hasMore: page < pages.length,
            loader: _react2.default.createElement(
                "div",
                { className: "loader1" },
                "Loading ..."
            )
        },
        data
    );
};

Paginate.propTypes = {
    count: _propTypes2.default.number,
    page: _propTypes2.default.number,
    changePage: _propTypes2.default.func
};
exports.default = Paginate;

/***/ }),

/***/ "./client/components/Post/AdjacentPosts.js":
/*!*************************************************!*\
  !*** ./client/components/Post/AdjacentPosts.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(/*! react */ "react");

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "react-router-dom");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Post = function Post(_ref) {
    var post = _ref.post,
        label = _ref.label;

    return _react2.default.createElement(
        "div",
        { className: "col-lg-6" },
        _react2.default.createElement(
            "strong",
            null,
            label,
            ":"
        ),
        _react2.default.createElement("br", null),
        _react2.default.createElement(
            _reactRouterDom.Link,
            { to: "/post/" + post.slug },
            post.title
        )
    );
};

var AdjacentPosts = function AdjacentPosts(_ref2) {
    var adjacentPosts = _ref2.adjacentPosts;

    var prev = adjacentPosts.previous ? _react2.default.createElement(Post, { post: adjacentPosts.previous, label: "Previous" }) : "";
    var next = adjacentPosts.next ? _react2.default.createElement(Post, { post: adjacentPosts.next, label: "Next" }) : "";
    return _react2.default.createElement(
        "div",
        { className: "row p-t-40" },
        prev,
        next
    );
};

exports.default = AdjacentPosts;

/***/ }),

/***/ "./client/components/Post/Article.js":
/*!*******************************************!*\
  !*** ./client/components/Post/Article.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "react");

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "react-router-dom");

var _moment = __webpack_require__(/*! moment */ "moment");

var _moment2 = _interopRequireDefault(_moment);

var _AdjacentPosts = __webpack_require__(/*! ./AdjacentPosts */ "./client/components/Post/AdjacentPosts.js");

var _AdjacentPosts2 = _interopRequireDefault(_AdjacentPosts);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Article = function (_Component) {
    _inherits(Article, _Component);

    function Article() {
        _classCallCheck(this, Article);

        return _possibleConstructorReturn(this, (Article.__proto__ || Object.getPrototypeOf(Article)).apply(this, arguments));
    }

    _createClass(Article, [{
        key: "render",
        value: function render() {
            var tags = [],
                categories = [];
            this.props.post.taxonomies.forEach(function (taxonomy, i) {
                if (taxonomy.type === "post_category") {
                    categories.push(_react2.default.createElement(
                        _reactRouterDom.Link,
                        { key: i, to: "/category/" + taxonomy.slug },
                        taxonomy.name
                    ));
                } else {
                    tags.push(_react2.default.createElement(
                        _reactRouterDom.Link,
                        { key: i, to: "/tag/" + taxonomy.slug },
                        "#",
                        taxonomy.name
                    ));
                }
            });

            return _react2.default.createElement(
                "div",
                null,
                _react2.default.createElement(
                    "div",
                    { className: "post-thumbnail" },
                    _react2.default.createElement("img", {
                        width: "100",
                        src: this.props.post.cover_image,
                        alt: this.props.title
                    })
                ),
                _react2.default.createElement(
                    "div",
                    { className: "card" },
                    _react2.default.createElement(
                        "article",
                        { className: "post" },
                        _react2.default.createElement(
                            "div",
                            { className: "post-header" },
                            _react2.default.createElement(
                                "h2",
                                { className: "post-title font-alt" },
                                _react2.default.createElement(
                                    _reactRouterDom.Link,
                                    { to: "#" },
                                    this.props.post.title
                                )
                            ),
                            _react2.default.createElement(
                                "div",
                                { className: "post-meta" },
                                (0, _moment2.default)(new Date(this.props.post.created_at)).format("LL"),
                                tags.length > 0 && _react2.default.createElement(
                                    "div",
                                    { className: "tags font-serif  p-t-30" },
                                    tags
                                )
                            )
                        ),
                        _react2.default.createElement(
                            "div",
                            { className: "post-content ql-editor fs-medium" },
                            _react2.default.createElement("p", {
                                dangerouslySetInnerHTML: {
                                    __html: this.props.post.body
                                }
                            })
                        ),
                        _react2.default.createElement(
                            "div",
                            { className: "tags font-serif  p-t-30" },
                            categories
                        ),
                        this.props.adjacentPosts && _react2.default.createElement(_AdjacentPosts2.default, {
                            adjacentPosts: this.props.adjacentPosts
                        })
                    )
                )
            );
        }
    }]);

    return Article;
}(_react.Component);

exports.default = Article;

/***/ }),

/***/ "./client/components/Post/ArticleListItem.js":
/*!***************************************************!*\
  !*** ./client/components/Post/ArticleListItem.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "react");

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "react-router-dom");

var _moment = __webpack_require__(/*! moment */ "moment");

var _moment2 = _interopRequireDefault(_moment);

var _LazyLoad = __webpack_require__(/*! ./LazyLoad */ "./client/components/Post/LazyLoad.js");

var _LazyLoad2 = _interopRequireDefault(_LazyLoad);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ArticleListItem = function (_Component) {
    _inherits(ArticleListItem, _Component);

    function ArticleListItem() {
        _classCallCheck(this, ArticleListItem);

        return _possibleConstructorReturn(this, (ArticleListItem.__proto__ || Object.getPrototypeOf(ArticleListItem)).apply(this, arguments));
    }

    _createClass(ArticleListItem, [{
        key: "render",
        value: function render() {
            var href = "/" + this.props.post.type + "/" + this.props.post.slug;
            return _react2.default.createElement(
                "div",
                null,
                this.props.post.cover_image && _react2.default.createElement(
                    "div",
                    { className: "post-thumbnail" },
                    _react2.default.createElement(
                        _reactRouterDom.Link,
                        { to: href },
                        _react2.default.createElement("img", {
                            className: "lazy-image",
                            "data-src": this.props.post.cover_image,
                            alt: this.props.title,
                            src: "/uploads/loading.jpg"
                        })
                    )
                ),
                _react2.default.createElement(
                    "div",
                    { className: "card" },
                    _react2.default.createElement(
                        "article",
                        { className: "post" },
                        _react2.default.createElement(
                            "div",
                            { className: "post-header" },
                            _react2.default.createElement(
                                "h2",
                                { className: "post-title font-alt" },
                                _react2.default.createElement(
                                    _reactRouterDom.Link,
                                    { to: href },
                                    this.props.post.title
                                )
                            ),
                            _react2.default.createElement(
                                "div",
                                { className: "post-meta" },
                                (0, _moment2.default)(new Date(this.props.post.created_at)).format("LL")
                            )
                        ),
                        _react2.default.createElement(
                            "div",
                            { className: "post-content" },
                            _react2.default.createElement(
                                "p",
                                null,
                                this.props.post.excerpt
                            ),
                            _react2.default.createElement(
                                _reactRouterDom.Link,
                                { className: "post-more", to: href },
                                "Read more"
                            )
                        )
                    )
                )
            );
        }
    }]);

    return ArticleListItem;
}(_react.Component);

exports.default = (0, _LazyLoad2.default)(ArticleListItem);

/***/ }),

/***/ "./client/components/Post/LazyLoad.js":
/*!********************************************!*\
  !*** ./client/components/Post/LazyLoad.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(/*! react-dom */ "react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LazyLoad = function LazyLoad(WrappedComponent) {
    return function (_Component) {
        _inherits(_class, _Component);

        function _class(props) {
            _classCallCheck(this, _class);

            var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

            _this.onIntersection = _this.onIntersection.bind(_this);
            _this.loadImage = _this.loadImage.bind(_this);
            _this.fetchImage = _this.fetchImage.bind(_this);
            var config = {
                // If the image gets within 50px in the Y axis, start the download.
                rootMargin: "50px 0px",
                threshold: 0.01
            };

            _this.isBrowser = typeof window !== "undefined";
            // The observer for the images on the page
            if (_this.isBrowser) {
                _this.observer = new IntersectionObserver(_this.onIntersection, config);
            }
            return _this;
        }

        _createClass(_class, [{
            key: "componentDidMount",
            value: function componentDidMount() {
                var _this2 = this;

                if (this.isBrowser) {
                    var images = _reactDom2.default.findDOMNode(this).querySelectorAll(".lazy-image");
                    images.forEach(function (image) {
                        _this2.observer.observe(image);
                    });
                }
            }
        }, {
            key: "fetchImage",
            value: function fetchImage(url) {
                return new Promise(function (resolve, reject) {
                    var image = new Image();
                    image.src = url;
                    image.onload = resolve;
                    image.onerror = reject;
                });
            }
        }, {
            key: "loadImage",
            value: function loadImage(image) {
                var src = image.dataset.src;
                this.fetchImage(src).then(function () {
                    image.src = src;
                });
            }
        }, {
            key: "onIntersection",
            value: function onIntersection(entries) {
                var _this3 = this;

                // Loop through the entries
                entries.forEach(function (entry) {
                    // Are we in viewport?
                    if (entry.intersectionRatio > 0) {
                        // Stop watching and load the image
                        _this3.observer.unobserve(entry.target);
                        _this3.loadImage(entry.target);
                    }
                });
            }
        }, {
            key: "render",
            value: function render() {
                return _react2.default.createElement(WrappedComponent, this.props);
            }
        }]);

        return _class;
    }(_react.Component);
};
exports.default = LazyLoad;

/***/ }),

/***/ "./client/components/SEO.js":
/*!**********************************!*\
  !*** ./client/components/SEO.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__(/*! react */ "react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(/*! prop-types */ "prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactHelmet = __webpack_require__(/*! react-helmet */ "react-helmet");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getMetaTags = function getMetaTags(_ref) {
    var title = _ref.title,
        description = _ref.description,
        path = _ref.path,
        contentType = _ref.contentType,
        published = _ref.published,
        updated = _ref.updated,
        category = _ref.category,
        tags = _ref.tags,
        twitter = _ref.twitter,
        image = _ref.image,
        settings = _ref.settings;

    var host = settings.site_url.value;
    var metaTags = [{ itemprop: "name", content: title }, { itemprop: "description", content: description }, { itemprop: "image", content: host + image }, { name: "description", content: description }, { name: "twitter:card", content: "summary_large_image" }, { name: "twitter:site", content: "@" + settings.social_twitter.value }, { name: "twitter:title", content: "" + title }, { name: "twitter:description", content: description }, {
        name: "twitter:creator",
        content: twitter || "@" + settings.social_twitter.value
    }, { name: "twitter:image:src", content: host + image }, { name: "og:title", content: "" + title }, { name: "og:type", content: contentType }, { name: "og:url", content: host + path }, { name: "og:image", content: host + image }, { name: "og:description", content: description }, { name: "og:site_name", content: settings.site_title.value }];

    if (published) metaTags.push({ name: "article:published_time", content: published });
    if (updated) metaTags.push({ name: "article:modified_time", content: updated });
    if (category) metaTags.push({ name: "article:section", content: category });
    if (tags) metaTags.push({ name: "article:tag", content: tags });

    return metaTags;
};

var SEO = function SEO(props) {
    return _react2.default.createElement(_reactHelmet.Helmet, {
        htmlAttributes: {
            lang: "en",
            itemscope: undefined,
            itemtype: "http://schema.org/" + props.schema
        },
        title: props.title,
        link: [{ rel: "canonical", href: props.path }],
        meta: getMetaTags(_extends({}, props))
    });
};

SEO.propTypes = {
    schema: _propTypes2.default.string,
    title: _propTypes2.default.string,
    description: _propTypes2.default.string,
    path: _propTypes2.default.string,
    contentType: _propTypes2.default.string,
    published: _propTypes2.default.string,
    updated: _propTypes2.default.string,
    category: _propTypes2.default.string,
    tags: _propTypes2.default.array,
    twitter: _propTypes2.default.string,
    image: _propTypes2.default.string,
    settings: _propTypes2.default.object
};

exports.default = SEO;

/***/ }),

/***/ "./client/components/Sidebar/About.js":
/*!********************************************!*\
  !*** ./client/components/Sidebar/About.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var About = function (_Component) {
    _inherits(About, _Component);

    function About() {
        _classCallCheck(this, About);

        return _possibleConstructorReturn(this, (About.__proto__ || Object.getPrototypeOf(About)).apply(this, arguments));
    }

    _createClass(About, [{
        key: "render",
        value: function render() {
            return _react2.default.createElement(
                "div",
                { className: "card" },
                _react2.default.createElement(
                    "div",
                    { className: "module-title" },
                    "About"
                ),
                _react2.default.createElement(
                    "div",
                    { className: "x_content" },
                    this.props.about
                )
            );
        }
    }]);

    return About;
}(_react.Component);

exports.default = About;

/***/ }),

/***/ "./client/components/Sidebar/Categories.js":
/*!*************************************************!*\
  !*** ./client/components/Sidebar/Categories.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "react");

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "react-router-dom");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Categories = function (_Component) {
    _inherits(Categories, _Component);

    function Categories() {
        _classCallCheck(this, Categories);

        return _possibleConstructorReturn(this, (Categories.__proto__ || Object.getPrototypeOf(Categories)).apply(this, arguments));
    }

    _createClass(Categories, [{
        key: "getLink",
        value: function getLink(_ref) {
            var name = _ref.name,
                slug = _ref.slug;

            var link = "/category/" + slug;
            return _react2.default.createElement(
                _reactRouterDom.Link,
                { to: link },
                name
            );
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            return _react2.default.createElement(
                "div",
                { className: "card" },
                _react2.default.createElement(
                    "div",
                    { className: "module-title" },
                    "Categories"
                ),
                _react2.default.createElement(
                    "div",
                    { className: "x_content" },
                    _react2.default.createElement(
                        "ul",
                        null,
                        function () {
                            if (_this2.props.loading) {
                                return _react2.default.createElement(
                                    "div",
                                    null,
                                    "Loading..."
                                );
                            }
                            return _this2.props.categories.map(function (category, i) {
                                return _react2.default.createElement(
                                    "li",
                                    { key: i },
                                    _this2.getLink(category)
                                );
                            });
                        }()
                    )
                )
            );
        }
    }]);

    return Categories;
}(_react.Component);

exports.default = Categories;

/***/ }),

/***/ "./client/components/Sidebar/LatestPosts.js":
/*!**************************************************!*\
  !*** ./client/components/Sidebar/LatestPosts.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "react");

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "react-router-dom");

var _moment = __webpack_require__(/*! moment */ "moment");

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Item = function Item(_ref) {
    var style = _ref.style,
        post = _ref.post;

    return _react2.default.createElement(
        "li",
        { style: style.item },
        _react2.default.createElement(
            "div",
            { style: style.imageWrapper },
            _react2.default.createElement(
                _reactRouterDom.Link,
                { to: "/" + post.type + "/" + post.slug },
                _react2.default.createElement("img", { style: style.image, src: post.cover_image })
            )
        ),
        _react2.default.createElement(
            "div",
            { className: "content", style: style.content },
            _react2.default.createElement(
                _reactRouterDom.Link,
                { to: "/" + post.type + "/" + post.slug },
                post.title
            ),
            _react2.default.createElement(
                "span",
                { style: style.time },
                (0, _moment2.default)(post.created_at).fromNow()
            )
        )
    );
};

var LatestPosts = function (_Component) {
    _inherits(LatestPosts, _Component);

    function LatestPosts() {
        _classCallCheck(this, LatestPosts);

        return _possibleConstructorReturn(this, (LatestPosts.__proto__ || Object.getPrototypeOf(LatestPosts)).apply(this, arguments));
    }

    _createClass(LatestPosts, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            var style = {
                item: {
                    display: "flex",
                    alignItems: "flex-start",
                    marginBottom: 12
                },
                content: {
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: 8
                },
                imageWrapper: {
                    width: 80,
                    height: 60
                },
                image: {
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                },
                time: {
                    fontSize: 12
                }
            };
            return _react2.default.createElement(
                "div",
                { className: "card" },
                _react2.default.createElement(
                    "div",
                    { className: "module-title" },
                    "Latest Posts"
                ),
                _react2.default.createElement(
                    "div",
                    { className: "x_content" },
                    _react2.default.createElement(
                        "ul",
                        null,
                        function () {
                            if (_this2.props.loading) {
                                return _react2.default.createElement(
                                    "div",
                                    null,
                                    "Loading..."
                                );
                            }
                            return _this2.props.posts.rows.map(function (post, i) {
                                return _react2.default.createElement(Item, { key: i, style: style, post: post });
                            });
                        }()
                    )
                )
            );
        }
    }]);

    return LatestPosts;
}(_react.Component);

exports.default = LatestPosts;

/***/ }),

/***/ "./client/components/Sidebar/Search.js":
/*!*********************************************!*\
  !*** ./client/components/Sidebar/Search.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// A hack to remember the search text locally without asking parent
var SEARCH_TEXT_STATE = "";

var Search = function (_Component) {
    _inherits(Search, _Component);

    function Search(props) {
        _classCallCheck(this, Search);

        var _this = _possibleConstructorReturn(this, (Search.__proto__ || Object.getPrototypeOf(Search)).call(this, props));

        _this.state = {
            search: SEARCH_TEXT_STATE
        };
        _this.onChange = _this.onChange.bind(_this);
        _this.doSearch = _this.doSearch.bind(_this);
        return _this;
    }

    _createClass(Search, [{
        key: "onChange",
        value: function onChange(e) {
            this.setState({ search: e.target.value });
        }
    }, {
        key: "doSearch",
        value: function doSearch(e) {
            var query = e.target.value.trim();
            if (query.length > 0) {
                SEARCH_TEXT_STATE = query;
                this.props.history.push("/search/" + query);

                setTimeout(function () {
                    // refs will not work because it looses value
                    document.querySelector("#search-input").focus();
                }, 600);
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            return _react2.default.createElement(
                "div",
                { className: "card" },
                _react2.default.createElement(
                    "div",
                    { className: "module-title" },
                    "Search"
                ),
                _react2.default.createElement(
                    "div",
                    { className: "x_content" },
                    _react2.default.createElement(
                        "div",
                        { className: "form-group" },
                        _react2.default.createElement("input", {
                            className: "form-control",
                            value: this.state.search,
                            onChange: this.onChange,
                            placeholder: "Search the site",
                            onKeyPress: function onKeyPress(e) {
                                return e.charCode === 13 && _this2.doSearch(e);
                            },
                            id: "search-input"
                        })
                    )
                )
            );
        }
    }]);

    return Search;
}(_react.Component);

exports.default = Search;

/***/ }),

/***/ "./client/containers/Hoc/WithResize.js":
/*!*********************************************!*\
  !*** ./client/containers/Hoc/WithResize.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WithResize = function WithResize(WrappedComonent) {
    return function (_Component) {
        _inherits(_class, _Component);

        function _class(props) {
            _classCallCheck(this, _class);

            var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

            _this.onResize = _this.onResize.bind(_this);
            _this.setResizeTracker = _this.setResizeTracker.bind(_this);
            _this.tracker = null;
            _this.mounted = false;
            _this.timer = null;
            _this.state = {
                clientWidth: 0
            };
            return _this;
        }

        _createClass(_class, [{
            key: "componentDidMount",
            value: function componentDidMount() {
                this.mounted = true;
                window.addEventListener("resize", this.onResize);
                this.onResize();
            }
        }, {
            key: "componentWillUnmount",
            value: function componentWillUnmount() {
                this.mounted = false;
                window.removeEventListener("resize", this.onResize);
            }
        }, {
            key: "setResizeTracker",
            value: function setResizeTracker(tracker) {
                this.tracker = tracker;
            }
        }, {
            key: "onResize",
            value: function onResize() {
                var _this2 = this;

                clearTimeout(this.timer);
                this.timer = setTimeout(function () {
                    if (_this2.mounted) {
                        var tracker = document.querySelector(_this2.tracker);

                        var _ref = tracker || document.body,
                            clientWidth = _ref.clientWidth;

                        _this2.setState({ clientWidth: clientWidth });
                    }
                }, 50);
            }
        }, {
            key: "render",
            value: function render() {
                return _react2.default.createElement(WrappedComonent, _extends({
                    setResizeTracker: this.setResizeTracker
                }, this.props, this.state));
            }
        }]);

        return _class;
    }(_react.Component);
};

exports.default = WithResize;

/***/ }),

/***/ "./client/containers/Home.js":
/*!***********************************!*\
  !*** ./client/containers/Home.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(/*! prop-types */ "prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Posts = __webpack_require__(/*! ./Posts */ "./client/containers/Posts.js");

var _Posts2 = _interopRequireDefault(_Posts);

var _SinglePage = __webpack_require__(/*! ./SinglePage */ "./client/containers/SinglePage.js");

var _SinglePage2 = _interopRequireDefault(_SinglePage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Home = function (_Component) {
    _inherits(Home, _Component);

    function Home() {
        _classCallCheck(this, Home);

        return _possibleConstructorReturn(this, (Home.__proto__ || Object.getPrototypeOf(Home)).apply(this, arguments));
    }

    _createClass(Home, [{
        key: "render",
        value: function render() {
            // To get the homepage, parse the menu settings and see if there is any label by the name Home.
            // If not, then take the first item as the home
            var menu = JSON.parse(this.props.settings.menu.value);
            var home = menu.filter(function (item) {
                return item.label === "Home";
            });
            if (home.length === 0) {
                home = [menu[0]];
            }
            if (this.props.match.path === "/") {
                if (home[0].type === "category") {
                    return _react2.default.createElement(_Posts2.default, _extends({ slug: home[0].slug }, this.props));
                }
            }
            return _react2.default.createElement(_SinglePage2.default, _extends({ slug: home[0].slug }, this.props));
        }
    }]);

    return Home;
}(_react.Component);

exports.default = Home;


Home.propTypes = {
    settings: _propTypes2.default.object,
    route: _propTypes2.default.func,
    match: _propTypes2.default.object
};

/***/ }),

/***/ "./client/containers/Posts.js":
/*!************************************!*\
  !*** ./client/containers/Posts.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "react");

var _react2 = _interopRequireDefault(_react);

var _ArticleListItem = __webpack_require__(/*! ../components/Post/ArticleListItem */ "./client/components/Post/ArticleListItem.js");

var _ArticleListItem2 = _interopRequireDefault(_ArticleListItem);

var _reactStackGrid = __webpack_require__(/*! react-stack-grid */ "react-stack-grid");

var _reactStackGrid2 = _interopRequireDefault(_reactStackGrid);

var _Loader = __webpack_require__(/*! ../components/Loader */ "./client/components/Loader.js");

var _Loader2 = _interopRequireDefault(_Loader);

var _config = __webpack_require__(/*! ../../config */ "./config/index.js");

var _config2 = _interopRequireDefault(_config);

var _Paginate = __webpack_require__(/*! ../components/Paginate */ "./client/components/Paginate.js");

var _Paginate2 = _interopRequireDefault(_Paginate);

var _OhSnap = __webpack_require__(/*! ../components/OhSnap */ "./client/components/OhSnap.js");

var _OhSnap2 = _interopRequireDefault(_OhSnap);

var _WithResize = __webpack_require__(/*! ./Hoc/WithResize */ "./client/containers/Hoc/WithResize.js");

var _WithResize2 = _interopRequireDefault(_WithResize);

var _PostsData = __webpack_require__(/*! ../data-supply/PostsData */ "./client/data-supply/PostsData.js");

var _PostsData2 = _interopRequireDefault(_PostsData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Posts = function (_Component) {
    _inherits(Posts, _Component);

    function Posts(props) {
        _classCallCheck(this, Posts);

        var _this = _possibleConstructorReturn(this, (Posts.__proto__ || Object.getPrototypeOf(Posts)).call(this, props));

        _this.loadMore = _this.loadMore.bind(_this);
        _this.page = 1;
        _this.state = {
            posts: []
        };
        return _this;
    }

    _createClass(Posts, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            document.body.classList.add("posts-page");
            this.props.setResizeTracker(".post-grid");
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            document.body.classList.remove("posts-page");
        }
    }, {
        key: "loadMore",
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(num) {
                var result;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.props.fetchMore({
                                    type: "post_category",
                                    slug: this.props.slug || this.props.match.params.slug,
                                    postType: "post",
                                    limit: _config2.default.itemsPerPage,
                                    offset: (num - 1) * _config2.default.itemsPerPage
                                });

                            case 2:
                                result = _context.sent;

                                this.page = num;

                            case 4:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function loadMore(_x) {
                return _ref.apply(this, arguments);
            }

            return loadMore;
        }()
    }, {
        key: "render",
        value: function render() {
            if (this.props.loading) {
                return _react2.default.createElement(_Loader2.default, null);
            }
            if (!this.props.posts) {
                return _react2.default.createElement(_OhSnap2.default, { message: this.props.settings.search_notFound.value });
            }
            if (this.props.posts.length === 0) {
                return _react2.default.createElement(_OhSnap2.default, { message: this.props.settings.text_posts_empty.value });
            }
            var windowWidth = this.props.clientWidth;
            var gridWidth = "50%";
            if (windowWidth < 600) {
                gridWidth = "100%";
            }

            var posts = this.props.settings.post_display.value == "row" ? _react2.default.createElement(
                "div",
                { className: "post-row" },
                this.props.posts.map(function (post, i) {
                    return _react2.default.createElement(_ArticleListItem2.default, { idx: i, key: i, post: post });
                })
            ) : _react2.default.createElement(
                _reactStackGrid2.default,
                {
                    className: "post-grid",
                    columnWidth: gridWidth,
                    gutterWidth: 12,
                    gutterHeight: 12,
                    enableSSR: true,
                    duration: 0,
                    appearDelay: 0
                },
                this.props.posts.map(function (post, i) {
                    return _react2.default.createElement(_ArticleListItem2.default, { idx: i, key: i, post: post });
                })
            );

            return _react2.default.createElement(_Paginate2.default, {
                data: posts,
                count: this.props.total,
                page: this.page,
                loadMore: this.loadMore
            });
        }
    }]);

    return Posts;
}(_react.Component);

exports.default = (0, _PostsData2.default)((0, _WithResize2.default)(Posts));

/***/ }),

/***/ "./client/containers/SearchWrapper.js":
/*!********************************************!*\
  !*** ./client/containers/SearchWrapper.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "react");

var _react2 = _interopRequireDefault(_react);

var _reactApollo = __webpack_require__(/*! react-apollo */ "react-apollo");

var _reactStackGrid = __webpack_require__(/*! react-stack-grid */ "react-stack-grid");

var _reactStackGrid2 = _interopRequireDefault(_reactStackGrid);

var _ArticleListItem = __webpack_require__(/*! ../components/Post/ArticleListItem */ "./client/components/Post/ArticleListItem.js");

var _ArticleListItem2 = _interopRequireDefault(_ArticleListItem);

var _apolloClient = __webpack_require__(/*! ../apolloClient */ "./client/apolloClient.js");

var _apolloClient2 = _interopRequireDefault(_apolloClient);

var _config = __webpack_require__(/*! ../../config */ "./config/index.js");

var _config2 = _interopRequireDefault(_config);

var _Loader = __webpack_require__(/*! ../components/Loader */ "./client/components/Loader.js");

var _Loader2 = _interopRequireDefault(_Loader);

var _Queries = __webpack_require__(/*! ../../shared/queries/Queries */ "./shared/queries/Queries.js");

var _Paginate = __webpack_require__(/*! ../components/Paginate */ "./client/components/Paginate.js");

var _Paginate2 = _interopRequireDefault(_Paginate);

var _OhSnap = __webpack_require__(/*! ../components/OhSnap */ "./client/components/OhSnap.js");

var _OhSnap2 = _interopRequireDefault(_OhSnap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SearchWrapper = function (_Component) {
    _inherits(SearchWrapper, _Component);

    function SearchWrapper(props) {
        _classCallCheck(this, SearchWrapper);

        var _this = _possibleConstructorReturn(this, (SearchWrapper.__proto__ || Object.getPrototypeOf(SearchWrapper)).call(this, props));

        _this.loadData = _this.loadData.bind(_this);
        _this.state = {
            loading: true,
            posts: [],
            pageNo: {
                category: 1,
                tag: 1,
                post: 1
            },
            total: 0
        };
        return _this;
    }

    _createClass(SearchWrapper, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            this.loadData();
        }
    }, {
        key: "loadData",
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var num = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

                var term, offset, result, _result, _result2;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                term = this.props.type;
                                offset = (num - 1) * _config2.default.itemsPerPage;

                                if (!(term === "post")) {
                                    _context.next = 9;
                                    break;
                                }

                                _context.next = 5;
                                return _apolloClient2.default.query({
                                    query: _Queries.SEARCH_POSTS,
                                    variables: {
                                        query: '{ "like": "%' + this.props.match.params.query + '%" }',
                                        limit: _config2.default.itemsPerPage,
                                        offset: offset
                                    }
                                });

                            case 5:
                                result = _context.sent;

                                this.setState({
                                    loading: false,
                                    posts: [].concat(_toConsumableArray(this.state.posts), _toConsumableArray(result.data.posts.rows)),
                                    total: result.data.posts.count,
                                    pageNo: _extends({}, this.state.pageNo, {
                                        post: num
                                    })
                                });
                                _context.next = 21;
                                break;

                            case 9:
                                if (!(term === "category")) {
                                    _context.next = 16;
                                    break;
                                }

                                _context.next = 12;
                                return _apolloClient2.default.query({
                                    query: _Queries.SEARCH_POSTS_BY_TAXONOMY,
                                    variables: {
                                        type: "post_category",
                                        slug: this.props.match.params.query,
                                        postType: "post",
                                        limit: _config2.default.itemsPerPage,
                                        offset: offset
                                    }
                                });

                            case 12:
                                _result = _context.sent;

                                this.setState({
                                    loading: false,
                                    posts: [].concat(_toConsumableArray(this.state.posts), _toConsumableArray(_result.data.postsByTaxSlug.posts)),
                                    total: _result.data.postsByTaxSlug.count,
                                    pageNo: _extends({}, this.state.pageNo, {
                                        category: num
                                    })
                                });
                                _context.next = 21;
                                break;

                            case 16:
                                if (!(term === "tag")) {
                                    _context.next = 21;
                                    break;
                                }

                                _context.next = 19;
                                return _apolloClient2.default.query({
                                    query: _Queries.SEARCH_POSTS_BY_TAXONOMY,
                                    variables: {
                                        type: "post_tag",
                                        query: this.props.match.params.query,
                                        postType: "post",
                                        limit: _config2.default.itemsPerPage,
                                        offset: offset
                                    }
                                });

                            case 19:
                                _result2 = _context.sent;

                                this.setState({
                                    loading: false,
                                    posts: _result2.data.postsByTaxSlug.posts,
                                    total: _result2.data.postsByTaxSlug.count,
                                    pageNo: _extends({}, this.state.pageNo, {
                                        tag: num
                                    })
                                });

                            case 21:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function loadData() {
                return _ref.apply(this, arguments);
            }

            return loadData;
        }()
    }, {
        key: "render",
        value: function render() {
            if (this.state.loading) {
                return _react2.default.createElement(_Loader2.default, null);
            }
            var posts = this.state.posts.map(function (post, i) {
                return _react2.default.createElement(_ArticleListItem2.default, { idx: i, key: i, post: post });
            });

            var data = this.props.settings.post_display.value == "row" ? _react2.default.createElement(
                "div",
                { className: "post-row" },
                posts
            ) : _react2.default.createElement(
                "div",
                null,
                _react2.default.createElement(
                    _reactStackGrid2.default,
                    {
                        className: "post-grid",
                        columnWidth: "50%",
                        gutterWidth: 12,
                        gutterHeight: 12
                    },
                    posts
                )
            );

            if (data.length === 0) {
                return _react2.default.createElement(_OhSnap2.default, { message: "wow" });
            }
            var type = this.props.type;
            return _react2.default.createElement(
                "div",
                null,
                _react2.default.createElement(_Paginate2.default, {
                    data: data,
                    count: this.state.total,
                    page: this.state.pageNo[type],
                    loadMore: this.loadData
                })
            );
        }
    }]);

    return SearchWrapper;
}(_react.Component);

exports.default = SearchWrapper;

/***/ }),

/***/ "./client/containers/Sidebar.js":
/*!**************************************!*\
  !*** ./client/containers/Sidebar.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "react");

var _react2 = _interopRequireDefault(_react);

var _About = __webpack_require__(/*! ../components/Sidebar/About */ "./client/components/Sidebar/About.js");

var _About2 = _interopRequireDefault(_About);

var _Search = __webpack_require__(/*! ../components/Sidebar/Search */ "./client/components/Sidebar/Search.js");

var _Search2 = _interopRequireDefault(_Search);

var _Categories = __webpack_require__(/*! ../components/Sidebar/Categories */ "./client/components/Sidebar/Categories.js");

var _Categories2 = _interopRequireDefault(_Categories);

var _LatestPosts = __webpack_require__(/*! ../components/Sidebar/LatestPosts */ "./client/components/Sidebar/LatestPosts.js");

var _LatestPosts2 = _interopRequireDefault(_LatestPosts);

var _reactApollo = __webpack_require__(/*! react-apollo */ "react-apollo");

var _Queries = __webpack_require__(/*! ../../shared/queries/Queries */ "./shared/queries/Queries.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Sidebar = function (_Component) {
    _inherits(Sidebar, _Component);

    function Sidebar(props) {
        _classCallCheck(this, Sidebar);

        return _possibleConstructorReturn(this, (Sidebar.__proto__ || Object.getPrototypeOf(Sidebar)).call(this, props));
    }

    _createClass(Sidebar, [{
        key: "render",
        value: function render() {
            return _react2.default.createElement(
                "div",
                null,
                _react2.default.createElement(_Search2.default, { history: this.props.history }),
                _react2.default.createElement(_About2.default, { about: this.props.settings.sidebar_about.value }),
                _react2.default.createElement(_Categories2.default, {
                    loading: this.props.loading,
                    categories: this.props.categories
                }),
                _react2.default.createElement(_LatestPosts2.default, {
                    loading: this.props.ploading,
                    posts: this.props.posts
                })
            );
        }
    }]);

    return Sidebar;
}(_react.Component);

var ContainerWithCatData = (0, _reactApollo.graphql)(_Queries.GET_POSTS_LINKED_TAXONOMIES, {
    options: {
        variables: { type: "post_category", postType: "post" }
    },
    props: function props(_ref) {
        var _ref$data = _ref.data,
            loading = _ref$data.loading,
            postTaxonomies = _ref$data.postTaxonomies;
        return {
            categories: postTaxonomies,
            loading: loading
        };
    }
});

var ContainerWithLatestPosts = (0, _reactApollo.graphql)(_Queries.GET_LATEST_PUBLISHED_POSTS, {
    options: function options(props) {
        return {
            variables: {
                type: "post",
                limit: parseInt(props.settings.sidebar_latest_post_count.value)
            }
        };
    },
    props: function props(_ref2) {
        var _ref2$data = _ref2.data,
            loading = _ref2$data.loading,
            posts = _ref2$data.posts;
        return {
            posts: posts,
            ploading: loading
        };
    }
});

exports.default = ContainerWithLatestPosts(ContainerWithCatData(Sidebar));

/***/ }),

/***/ "./client/containers/SinglePage.js":
/*!*****************************************!*\
  !*** ./client/containers/SinglePage.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "react");

var _react2 = _interopRequireDefault(_react);

var _Article = __webpack_require__(/*! ../components/Post/Article */ "./client/components/Post/Article.js");

var _Article2 = _interopRequireDefault(_Article);

var _Loader = __webpack_require__(/*! ../components/Loader */ "./client/components/Loader.js");

var _Loader2 = _interopRequireDefault(_Loader);

var _SEO = __webpack_require__(/*! ../components/SEO */ "./client/components/SEO.js");

var _SEO2 = _interopRequireDefault(_SEO);

var _OhSnap = __webpack_require__(/*! ../components/OhSnap */ "./client/components/OhSnap.js");

var _OhSnap2 = _interopRequireDefault(_OhSnap);

var _SinglePageData = __webpack_require__(/*! ../data-supply/SinglePageData */ "./client/data-supply/SinglePageData.js");

var _SinglePageData2 = _interopRequireDefault(_SinglePageData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SinglePage = function (_Component) {
    _inherits(SinglePage, _Component);

    function SinglePage() {
        _classCallCheck(this, SinglePage);

        return _possibleConstructorReturn(this, (SinglePage.__proto__ || Object.getPrototypeOf(SinglePage)).apply(this, arguments));
    }

    _createClass(SinglePage, [{
        key: "render",
        value: function render() {
            if (this.props.loading) {
                return _react2.default.createElement(_Loader2.default, null);
            }
            if (!this.props.page.ok) {
                return _react2.default.createElement(_OhSnap2.default, { message: "Sorry, this page does not exist or might be restricted." });
            }
            var post = this.props.page.post;
            var tags = [],
                categories = [];
            post.taxonomies.forEach(function (taxonomy) {
                if (taxonomy.type === "post_category") {
                    categories.push(taxonomy.name);
                } else {
                    tags.push(taxonomy.name);
                }
            });
            return _react2.default.createElement(
                "div",
                null,
                _react2.default.createElement(_SEO2.default, {
                    schema: "BlogPosting",
                    title: post.title,
                    description: post.excerpt,
                    path: "/post/" + this.props.match.params.slug,
                    contentType: "article",
                    category: categories.join(","),
                    tags: tags,
                    image: post.cover_image,
                    settings: this.props.settings || {}
                }),
                _react2.default.createElement(_Article2.default, { post: post }),
                ";"
            );
        }
    }]);

    return SinglePage;
}(_react.Component);

exports.default = (0, _SinglePageData2.default)(SinglePage);

/***/ }),

/***/ "./client/containers/SinglePost.js":
/*!*****************************************!*\
  !*** ./client/containers/SinglePost.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "react");

var _react2 = _interopRequireDefault(_react);

var _Article = __webpack_require__(/*! ../components/Post/Article */ "./client/components/Post/Article.js");

var _Article2 = _interopRequireDefault(_Article);

var _Loader = __webpack_require__(/*! ../components/Loader */ "./client/components/Loader.js");

var _Loader2 = _interopRequireDefault(_Loader);

var _SEO = __webpack_require__(/*! ../components/SEO */ "./client/components/SEO.js");

var _SEO2 = _interopRequireDefault(_SEO);

var _propTypes = __webpack_require__(/*! prop-types */ "prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _OhSnap = __webpack_require__(/*! ../components/OhSnap */ "./client/components/OhSnap.js");

var _OhSnap2 = _interopRequireDefault(_OhSnap);

var _AdjacentPostsData = __webpack_require__(/*! ../data-supply/AdjacentPostsData */ "./client/data-supply/AdjacentPostsData.js");

var _AdjacentPostsData2 = _interopRequireDefault(_AdjacentPostsData);

var _SinglePostData = __webpack_require__(/*! ../data-supply/SinglePostData */ "./client/data-supply/SinglePostData.js");

var _SinglePostData2 = _interopRequireDefault(_SinglePostData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SinglePost = function (_Component) {
    _inherits(SinglePost, _Component);

    function SinglePost() {
        _classCallCheck(this, SinglePost);

        return _possibleConstructorReturn(this, (SinglePost.__proto__ || Object.getPrototypeOf(SinglePost)).apply(this, arguments));
    }

    _createClass(SinglePost, [{
        key: "render",
        value: function render() {
            if (this.props.loading || this.props.adjPostsLoading) {
                return _react2.default.createElement(_Loader2.default, null);
            }
            if (this.props.post === null) {
                return _react2.default.createElement(_OhSnap2.default, { message: "Sorry, this page does not exist or might be restricted." });
            }
            var tags = [],
                categories = [];
            this.props.post.taxonomies.forEach(function (taxonomy) {
                if (taxonomy.type === "post_category") {
                    categories.push(taxonomy.name);
                } else {
                    tags.push(taxonomy.name);
                }
            });

            return _react2.default.createElement(
                "div",
                null,
                _react2.default.createElement(_SEO2.default, {
                    schema: "BlogPosting",
                    title: this.props.post.title,
                    description: this.props.post.excerpt,
                    path: "/post/" + this.props.match.params.slug,
                    contentType: "article",
                    category: categories.join(","),
                    tags: tags,
                    image: this.props.post.cover_image,
                    settings: this.props.settings || {}
                }),
                _react2.default.createElement(_Article2.default, {
                    post: this.props.post,
                    adjacentPosts: this.props.adjacentPosts
                })
            );
        }
    }]);

    return SinglePost;
}(_react.Component);

SinglePost.propTypes = {
    post: _propTypes2.default.object,
    adjacentPosts: _propTypes2.default.object
};
exports.default = (0, _AdjacentPostsData2.default)((0, _SinglePostData2.default)(SinglePost));

/***/ }),

/***/ "./client/data-supply/AdjacentPostsData.js":
/*!*************************************************!*\
  !*** ./client/data-supply/AdjacentPostsData.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _reactApollo = __webpack_require__(/*! react-apollo */ "react-apollo");

var _Queries = __webpack_require__(/*! ../../shared/queries/Queries */ "./shared/queries/Queries.js");

exports.default = (0, _reactApollo.graphql)(_Queries.ADJACENT_POSTS, {
    options: function options(props) {
        return {
            variables: {
                slug: props.match.params.slug
            }
        };
    },
    props: function props(_ref) {
        var _ref$data = _ref.data,
            loading = _ref$data.loading,
            adjacentPosts = _ref$data.adjacentPosts;
        return {
            adjacentPosts: adjacentPosts,
            adjPostsLoading: loading
        };
    }
});

/***/ }),

/***/ "./client/data-supply/PostsData.js":
/*!*****************************************!*\
  !*** ./client/data-supply/PostsData.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _reactApollo = __webpack_require__(/*! react-apollo */ "react-apollo");

var _Queries = __webpack_require__(/*! ../../shared/queries/Queries */ "./shared/queries/Queries.js");

var _config = __webpack_require__(/*! ../../config */ "./config/index.js");

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = (0, _reactApollo.graphql)(_Queries.CAT_POSTS, {
    options: function options(props) {
        return {
            variables: {
                type: "post_category",
                slug: props.slug || props.match.params.slug,
                postType: "post",
                limit: _config2.default.itemsPerPage,
                offset: 0
            }
        };
    },
    props: function props(_ref) {
        var _ref$data = _ref.data,
            loading = _ref$data.loading,
            postsMenu = _ref$data.postsMenu,
            _fetchMore = _ref$data.fetchMore;

        return {
            posts: postsMenu && postsMenu.posts || [],
            total: postsMenu && postsMenu.count || 0,
            loading: loading,
            fetchMore: function fetchMore(variables) {
                return _fetchMore({
                    variables: variables,
                    updateQuery: function updateQuery(previousResult, _ref2) {
                        var fetchMoreResult = _ref2.fetchMoreResult;

                        return {
                            postsMenu: {
                                count: fetchMoreResult.postsMenu.count,
                                posts: [].concat(_toConsumableArray(previousResult.postsMenu.posts), _toConsumableArray(fetchMoreResult.postsMenu.posts))
                            }
                        };
                    }
                });
            }
        };
    }
});

/***/ }),

/***/ "./client/data-supply/SettingsData.js":
/*!********************************************!*\
  !*** ./client/data-supply/SettingsData.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _reactApollo = __webpack_require__(/*! react-apollo */ "react-apollo");

var _Queries = __webpack_require__(/*! ../../shared/queries/Queries */ "./shared/queries/Queries.js");

exports.default = (0, _reactApollo.graphql)(_Queries.GET_OPTIONS, {
    props: function props(_ref) {
        var _ref$data = _ref.data,
            loading = _ref$data.loading,
            settings = _ref$data.settings;

        var data = {};
        if (settings) {
            settings.forEach(function (setting) {
                data[setting.option] = setting;
            });
        }
        return {
            settings: {
                data: data,
                loading: loading
            }
        };
    }
});

/***/ }),

/***/ "./client/data-supply/SinglePageData.js":
/*!**********************************************!*\
  !*** ./client/data-supply/SinglePageData.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _reactApollo = __webpack_require__(/*! react-apollo */ "react-apollo");

var _Queries = __webpack_require__(/*! ../../shared/queries/Queries */ "./shared/queries/Queries.js");

exports.default = (0, _reactApollo.graphql)(_Queries.PAGE_MENU, {
    options: function options(props) {
        return {
            variables: {
                slug: props.slug || props.match.params.slug,
                postType: "page"
            }
        };
    },
    props: function props(_ref) {
        var _ref$data = _ref.data,
            loading = _ref$data.loading,
            pageMenu = _ref$data.pageMenu;
        return {
            page: pageMenu,
            loading: loading
        };
    }
});

/***/ }),

/***/ "./client/data-supply/SinglePostData.js":
/*!**********************************************!*\
  !*** ./client/data-supply/SinglePostData.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _reactApollo = __webpack_require__(/*! react-apollo */ "react-apollo");

var _Queries = __webpack_require__(/*! ../../shared/queries/Queries */ "./shared/queries/Queries.js");

exports.default = (0, _reactApollo.graphql)(_Queries.GET_POST_BY_SLUG, {
    options: function options(props) {
        return {
            variables: {
                type: "post",
                slug: props.match.params.slug
            }
        };
    },
    props: function props(_ref) {
        var _ref$data = _ref.data,
            loading = _ref$data.loading,
            post = _ref$data.post;
        return {
            post: post,
            loading: loading
        };
    }
});

/***/ }),

/***/ "./client/server.js":
/*!**************************!*\
  !*** ./client/server.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(/*! react */ "react");

var _react2 = _interopRequireDefault(_react);

var _server = __webpack_require__(/*! react-dom/server */ "./node_modules/react-dom/server.js");

var _reactHelmet = __webpack_require__(/*! react-helmet */ "react-helmet");

var _reactRouter = __webpack_require__(/*! react-router */ "react-router");

var _reactApollo = __webpack_require__(/*! react-apollo */ "react-apollo");

var _Route = __webpack_require__(/*! ./Route */ "./client/Route.js");

var _Route2 = _interopRequireDefault(_Route);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var context = {};

exports.default = function (req, client) {
    var apolloContext = {};

    var clientApp = _react2.default.createElement(
        _reactApollo.ApolloProvider,
        { client: client },
        _react2.default.createElement(
            _reactRouter.StaticRouter,
            { location: req.url, context: context },
            _react2.default.createElement(_Route2.default, null)
        )
    );

    return Promise.all([(0, _reactApollo.getDataFromTree)(clientApp)]).catch(function (err) {
        // log that I have an error, return the entire array;
        console.log("A promise failed to resolve", err);
    }).then(function () {
        return {
            head: _reactHelmet.Helmet.renderStatic(),
            html: (0, _server.renderToString)(clientApp),
            apolloState: client.extract()
        };
    });
};

/***/ }),

/***/ "./client/themes/amun/containers/Layout.js":
/*!*************************************************!*\
  !*** ./client/themes/amun/containers/Layout.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = Layout;

var _react = __webpack_require__(/*! react */ "react");

var _react2 = _interopRequireDefault(_react);

var _Sidebar = __webpack_require__(/*! client/containers/Sidebar */ "./client/containers/Sidebar.js");

var _Sidebar2 = _interopRequireDefault(_Sidebar);

var _Navbar = __webpack_require__(/*! client/components/Navbar */ "./client/components/Navbar/index.js");

var _Navbar2 = _interopRequireDefault(_Navbar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

__webpack_require__(/*! ../style.scss */ "./client/themes/amun/style.scss");

function Layout(Element, props) {
    var settings = props.settings;
    var layout = settings.layout_display.value;

    return function (_Component) {
        _inherits(_class, _Component);

        function _class() {
            _classCallCheck(this, _class);

            return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
        }

        _createClass(_class, [{
            key: "render",
            value: function render() {
                var _props = _extends({}, this.props, props, { settings: settings });
                return _react2.default.createElement(
                    "div",
                    { className: "main centered" },
                    _react2.default.createElement(
                        "nav",
                        { className: "navbar navbar-default" },
                        _react2.default.createElement(
                            "div",
                            { className: "container" },
                            _react2.default.createElement(_Navbar2.default, {
                                settings: settings,
                                position: "top",
                                router: _extends({}, this.props)
                            })
                        )
                    ),
                    _react2.default.createElement(
                        "main",
                        null,
                        _react2.default.createElement(Element, _props)
                    ),
                    _react2.default.createElement(
                        "aside",
                        null,
                        _react2.default.createElement(_Sidebar2.default, _extends({ settings: settings }, this.props))
                    )
                );
            }
        }]);

        return _class;
    }(_react.Component);
}

/***/ }),

/***/ "./client/themes/amun/style.scss":
/*!***************************************!*\
  !*** ./client/themes/amun/style.scss ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "header {\n    grid-area: header;\n}\n\nnav {\n    grid-area: nav;\n}\n\nmain {\n    grid-area: content;\n}\n\naside {\n    grid-area: side;\n}\n\n.centered.main {\n    display: grid;\n    grid-template-areas:\n            \"nav nav nav nav nav\"\n            \" . content content side .\"\n            \"footer footer footer footer footer\";\n    grid-template-columns: 2fr repeat(3, minmax(auto, 368px)) 2fr;\n    grid-template-rows: auto 1fr auto;\n    grid-gap: 16px;\n    height: 100vh;\n\n    nav .sidebar {\n            position: relative;\n            width: auto;\n    }\n}\n\n@media (max-width: 991px) {\n\n    .centered.main {\n        grid-template-areas:\n                \"nav\"\n                \"content\"\n                \"side\"\n                \"footer\";\n        grid-template-columns: 1fr;\n        grid-template-rows:\n                auto\n                minmax(75px, auto)\n                1fr\n                minmax(75px, auto)\n                auto;\n        /* Footer */\n        margin-top: -16px;\n\n        main {\n                margin: 0 16px;\n        }\n    }\n\n    .centered {\n\n        aside {\n            display: none;\n        }\n    }\n}\n", ""]);

// exports


/***/ }),

/***/ "./config/config.dev.js":
/*!******************************!*\
  !*** ./config/config.dev.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
    appPort: 4040,
    apiPort: 3030,
    apiUrl: "http://localhost:3030/graphql",
    uploadUrl: "http://localhost:3030/upload",
    rootUrl: "http://localhost:4040/"
});


/***/ }),

/***/ "./config/config.prod.js":
/*!*******************************!*\
  !*** ./config/config.prod.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
    apiUrl: "http://api.letterpad.org/graphql",
    uploadUrl: "http://api.letterpad.org/upload",
    rootUrl: "http://letterpad.org/",
    appPort: 6060,
    apiPort: 6061
});


/***/ }),

/***/ "./config/index.js":
/*!*************************!*\
  !*** ./config/index.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _config_dev_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config.dev.js */ "./config/config.dev.js");
/* harmony import */ var _config_prod_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config.prod.js */ "./config/config.prod.js");



const env =
    "undefined" !== typeof window ? window.NODE_ENV : "dev";

const configFile = env === "dev" ? _config_dev_js__WEBPACK_IMPORTED_MODULE_0__["default"] : _config_prod_js__WEBPACK_IMPORTED_MODULE_1__["default"];

const config = new function(configFile) {
    this.rootUrl = configFile.rootUrl;
    this.apiUrl = configFile.apiUrl;
    this.uploadUrl = configFile.uploadUrl;
    this.appPort = configFile.appPort;
    this.apiPort = configFile.apiPort;
    this.defaultTitle = "Untitled";
    this.defaultSlug = "ajaxtown";
    this.adminPath = "/admin";
    this.itemsPerPage = 6;
}(configFile);

/* harmony default export */ __webpack_exports__["default"] = (config);


/***/ }),

/***/ "./node_modules/css-loader/lib/css-base.js":
/*!*************************************************!*\
  !*** ./node_modules/css-loader/lib/css-base.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ "./node_modules/fbjs/lib/camelize.js":
/*!*******************************************!*\
  !*** ./node_modules/fbjs/lib/camelize.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */

var _hyphenPattern = /-(.)/g;

/**
 * Camelcases a hyphenated string, for example:
 *
 *   > camelize('background-color')
 *   < "backgroundColor"
 *
 * @param {string} string
 * @return {string}
 */
function camelize(string) {
  return string.replace(_hyphenPattern, function (_, character) {
    return character.toUpperCase();
  });
}

module.exports = camelize;

/***/ }),

/***/ "./node_modules/fbjs/lib/camelizeStyleName.js":
/*!****************************************************!*\
  !*** ./node_modules/fbjs/lib/camelizeStyleName.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */



var camelize = __webpack_require__(/*! ./camelize */ "./node_modules/fbjs/lib/camelize.js");

var msPattern = /^-ms-/;

/**
 * Camelcases a hyphenated CSS property name, for example:
 *
 *   > camelizeStyleName('background-color')
 *   < "backgroundColor"
 *   > camelizeStyleName('-moz-transition')
 *   < "MozTransition"
 *   > camelizeStyleName('-ms-transition')
 *   < "msTransition"
 *
 * As Andi Smith suggests
 * (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
 * is converted to lowercase `ms`.
 *
 * @param {string} string
 * @return {string}
 */
function camelizeStyleName(string) {
  return camelize(string.replace(msPattern, 'ms-'));
}

module.exports = camelizeStyleName;

/***/ }),

/***/ "./node_modules/fbjs/lib/emptyFunction.js":
/*!************************************************!*\
  !*** ./node_modules/fbjs/lib/emptyFunction.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

module.exports = emptyFunction;

/***/ }),

/***/ "./node_modules/fbjs/lib/emptyObject.js":
/*!**********************************************!*\
  !*** ./node_modules/fbjs/lib/emptyObject.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



var emptyObject = {};

if (true) {
  Object.freeze(emptyObject);
}

module.exports = emptyObject;

/***/ }),

/***/ "./node_modules/fbjs/lib/hyphenate.js":
/*!********************************************!*\
  !*** ./node_modules/fbjs/lib/hyphenate.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */

var _uppercasePattern = /([A-Z])/g;

/**
 * Hyphenates a camelcased string, for example:
 *
 *   > hyphenate('backgroundColor')
 *   < "background-color"
 *
 * For CSS style names, use `hyphenateStyleName` instead which works properly
 * with all vendor prefixes, including `ms`.
 *
 * @param {string} string
 * @return {string}
 */
function hyphenate(string) {
  return string.replace(_uppercasePattern, '-$1').toLowerCase();
}

module.exports = hyphenate;

/***/ }),

/***/ "./node_modules/fbjs/lib/hyphenateStyleName.js":
/*!*****************************************************!*\
  !*** ./node_modules/fbjs/lib/hyphenateStyleName.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */



var hyphenate = __webpack_require__(/*! ./hyphenate */ "./node_modules/fbjs/lib/hyphenate.js");

var msPattern = /^ms-/;

/**
 * Hyphenates a camelcased CSS property name, for example:
 *
 *   > hyphenateStyleName('backgroundColor')
 *   < "background-color"
 *   > hyphenateStyleName('MozTransition')
 *   < "-moz-transition"
 *   > hyphenateStyleName('msTransition')
 *   < "-ms-transition"
 *
 * As Modernizr suggests (http://modernizr.com/docs/#prefixed), an `ms` prefix
 * is converted to `-ms-`.
 *
 * @param {string} string
 * @return {string}
 */
function hyphenateStyleName(string) {
  return hyphenate(string).replace(msPattern, '-ms-');
}

module.exports = hyphenateStyleName;

/***/ }),

/***/ "./node_modules/fbjs/lib/invariant.js":
/*!********************************************!*\
  !*** ./node_modules/fbjs/lib/invariant.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

if (true) {
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

module.exports = invariant;

/***/ }),

/***/ "./node_modules/fbjs/lib/memoizeStringOnly.js":
/*!****************************************************!*\
  !*** ./node_modules/fbjs/lib/memoizeStringOnly.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @typechecks static-only
 */



/**
 * Memoizes the return value of a function that accepts one string argument.
 */

function memoizeStringOnly(callback) {
  var cache = {};
  return function (string) {
    if (!cache.hasOwnProperty(string)) {
      cache[string] = callback.call(this, string);
    }
    return cache[string];
  };
}

module.exports = memoizeStringOnly;

/***/ }),

/***/ "./node_modules/fbjs/lib/warning.js":
/*!******************************************!*\
  !*** ./node_modules/fbjs/lib/warning.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



var emptyFunction = __webpack_require__(/*! ./emptyFunction */ "./node_modules/fbjs/lib/emptyFunction.js");

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = emptyFunction;

if (true) {
  var printWarning = function printWarning(format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  warning = function warning(condition, format) {
    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }

    if (format.indexOf('Failed Composite propType: ') === 0) {
      return; // Ignore CompositeComponent proptype check.
    }

    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(undefined, [format].concat(args));
    }
  };
}

module.exports = warning;

/***/ }),

/***/ "./node_modules/prop-types/checkPropTypes.js":
/*!***************************************************!*\
  !*** ./node_modules/prop-types/checkPropTypes.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



if (true) {
  var invariant = __webpack_require__(/*! fbjs/lib/invariant */ "./node_modules/fbjs/lib/invariant.js");
  var warning = __webpack_require__(/*! fbjs/lib/warning */ "./node_modules/fbjs/lib/warning.js");
  var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ "./node_modules/prop-types/lib/ReactPropTypesSecret.js");
  var loggedTypeFailures = {};
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (true) {
    for (var typeSpecName in typeSpecs) {
      if (typeSpecs.hasOwnProperty(typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          invariant(typeof typeSpecs[typeSpecName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'the `prop-types` package, but received `%s`.', componentName || 'React class', location, typeSpecName, typeof typeSpecs[typeSpecName]);
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error);
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          warning(false, 'Failed %s type: %s%s', location, error.message, stack != null ? stack : '');
        }
      }
    }
  }
}

module.exports = checkPropTypes;


/***/ }),

/***/ "./node_modules/prop-types/lib/ReactPropTypesSecret.js":
/*!*************************************************************!*\
  !*** ./node_modules/prop-types/lib/ReactPropTypesSecret.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),

/***/ "./node_modules/react-dom/cjs/react-dom-server.node.development.js":
/*!*************************************************************************!*\
  !*** ./node_modules/react-dom/cjs/react-dom-server.node.development.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/** @license React v16.2.0
 * react-dom-server.node.development.js
 *
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */





if (true) {
  (function() {
'use strict';

var invariant = __webpack_require__(/*! fbjs/lib/invariant */ "./node_modules/fbjs/lib/invariant.js");
var _assign = __webpack_require__(/*! object-assign */ "object-assign");
var React = __webpack_require__(/*! react */ "react");
var emptyFunction = __webpack_require__(/*! fbjs/lib/emptyFunction */ "./node_modules/fbjs/lib/emptyFunction.js");
var emptyObject = __webpack_require__(/*! fbjs/lib/emptyObject */ "./node_modules/fbjs/lib/emptyObject.js");
var hyphenateStyleName = __webpack_require__(/*! fbjs/lib/hyphenateStyleName */ "./node_modules/fbjs/lib/hyphenateStyleName.js");
var memoizeStringOnly = __webpack_require__(/*! fbjs/lib/memoizeStringOnly */ "./node_modules/fbjs/lib/memoizeStringOnly.js");
var warning = __webpack_require__(/*! fbjs/lib/warning */ "./node_modules/fbjs/lib/warning.js");
var checkPropTypes = __webpack_require__(/*! prop-types/checkPropTypes */ "./node_modules/prop-types/checkPropTypes.js");
var camelizeStyleName = __webpack_require__(/*! fbjs/lib/camelizeStyleName */ "./node_modules/fbjs/lib/camelizeStyleName.js");
var stream = __webpack_require__(/*! stream */ "stream");

/**
 * WARNING: DO NOT manually require this module.
 * This is a replacement for `invariant(...)` used by the error code system
 * and will _only_ be required by the corresponding babel pass.
 * It always throws.
 */

// These attributes should be all lowercase to allow for
// case insensitive checks
var RESERVED_PROPS = {
  children: true,
  dangerouslySetInnerHTML: true,
  defaultValue: true,
  defaultChecked: true,
  innerHTML: true,
  suppressContentEditableWarning: true,
  suppressHydrationWarning: true,
  style: true
};

function checkMask(value, bitmask) {
  return (value & bitmask) === bitmask;
}

var DOMPropertyInjection = {
  /**
   * Mapping from normalized, camelcased property names to a configuration that
   * specifies how the associated DOM property should be accessed or rendered.
   */
  MUST_USE_PROPERTY: 0x1,
  HAS_BOOLEAN_VALUE: 0x4,
  HAS_NUMERIC_VALUE: 0x8,
  HAS_POSITIVE_NUMERIC_VALUE: 0x10 | 0x8,
  HAS_OVERLOADED_BOOLEAN_VALUE: 0x20,
  HAS_STRING_BOOLEAN_VALUE: 0x40,

  /**
   * Inject some specialized knowledge about the DOM. This takes a config object
   * with the following properties:
   *
   * Properties: object mapping DOM property name to one of the
   * DOMPropertyInjection constants or null. If your attribute isn't in here,
   * it won't get written to the DOM.
   *
   * DOMAttributeNames: object mapping React attribute name to the DOM
   * attribute name. Attribute names not specified use the **lowercase**
   * normalized name.
   *
   * DOMAttributeNamespaces: object mapping React attribute name to the DOM
   * attribute namespace URL. (Attribute names not specified use no namespace.)
   *
   * DOMPropertyNames: similar to DOMAttributeNames but for DOM properties.
   * Property names not specified use the normalized name.
   *
   * DOMMutationMethods: Properties that require special mutation methods. If
   * `value` is undefined, the mutation method should unset the property.
   *
   * @param {object} domPropertyConfig the config as described above.
   */
  injectDOMPropertyConfig: function (domPropertyConfig) {
    var Injection = DOMPropertyInjection;
    var Properties = domPropertyConfig.Properties || {};
    var DOMAttributeNamespaces = domPropertyConfig.DOMAttributeNamespaces || {};
    var DOMAttributeNames = domPropertyConfig.DOMAttributeNames || {};
    var DOMMutationMethods = domPropertyConfig.DOMMutationMethods || {};

    for (var propName in Properties) {
      !!properties.hasOwnProperty(propName) ? invariant(false, "injectDOMPropertyConfig(...): You're trying to inject DOM property '%s' which has already been injected. You may be accidentally injecting the same DOM property config twice, or you may be injecting two configs that have conflicting property names.", propName) : void 0;

      var lowerCased = propName.toLowerCase();
      var propConfig = Properties[propName];

      var propertyInfo = {
        attributeName: lowerCased,
        attributeNamespace: null,
        propertyName: propName,
        mutationMethod: null,

        mustUseProperty: checkMask(propConfig, Injection.MUST_USE_PROPERTY),
        hasBooleanValue: checkMask(propConfig, Injection.HAS_BOOLEAN_VALUE),
        hasNumericValue: checkMask(propConfig, Injection.HAS_NUMERIC_VALUE),
        hasPositiveNumericValue: checkMask(propConfig, Injection.HAS_POSITIVE_NUMERIC_VALUE),
        hasOverloadedBooleanValue: checkMask(propConfig, Injection.HAS_OVERLOADED_BOOLEAN_VALUE),
        hasStringBooleanValue: checkMask(propConfig, Injection.HAS_STRING_BOOLEAN_VALUE)
      };
      !(propertyInfo.hasBooleanValue + propertyInfo.hasNumericValue + propertyInfo.hasOverloadedBooleanValue <= 1) ? invariant(false, "DOMProperty: Value can be one of boolean, overloaded boolean, or numeric value, but not a combination: %s", propName) : void 0;

      if (DOMAttributeNames.hasOwnProperty(propName)) {
        var attributeName = DOMAttributeNames[propName];

        propertyInfo.attributeName = attributeName;
      }

      if (DOMAttributeNamespaces.hasOwnProperty(propName)) {
        propertyInfo.attributeNamespace = DOMAttributeNamespaces[propName];
      }

      if (DOMMutationMethods.hasOwnProperty(propName)) {
        propertyInfo.mutationMethod = DOMMutationMethods[propName];
      }

      // Downcase references to whitelist properties to check for membership
      // without case-sensitivity. This allows the whitelist to pick up
      // `allowfullscreen`, which should be written using the property configuration
      // for `allowFullscreen`
      properties[propName] = propertyInfo;
    }
  }
};

/* eslint-disable max-len */
var ATTRIBUTE_NAME_START_CHAR = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
/* eslint-enable max-len */
var ATTRIBUTE_NAME_CHAR = ATTRIBUTE_NAME_START_CHAR + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040";


var ROOT_ATTRIBUTE_NAME = 'data-reactroot';

/**
 * Map from property "standard name" to an object with info about how to set
 * the property in the DOM. Each object contains:
 *
 * attributeName:
 *   Used when rendering markup or with `*Attribute()`.
 * attributeNamespace
 * propertyName:
 *   Used on DOM node instances. (This includes properties that mutate due to
 *   external factors.)
 * mutationMethod:
 *   If non-null, used instead of the property or `setAttribute()` after
 *   initial render.
 * mustUseProperty:
 *   Whether the property must be accessed and mutated as an object property.
 * hasBooleanValue:
 *   Whether the property should be removed when set to a falsey value.
 * hasNumericValue:
 *   Whether the property must be numeric or parse as a numeric and should be
 *   removed when set to a falsey value.
 * hasPositiveNumericValue:
 *   Whether the property must be positive numeric or parse as a positive
 *   numeric and should be removed when set to a falsey value.
 * hasOverloadedBooleanValue:
 *   Whether the property can be used as a flag as well as with a value.
 *   Removed when strictly equal to false; present without a value when
 *   strictly equal to true; present with a value otherwise.
 */
var properties = {};

/**
 * Checks whether a property name is a writeable attribute.
 * @method
 */
function shouldSetAttribute(name, value) {
  if (isReservedProp(name)) {
    return false;
  }
  if (name.length > 2 && (name[0] === 'o' || name[0] === 'O') && (name[1] === 'n' || name[1] === 'N')) {
    return false;
  }
  if (value === null) {
    return true;
  }
  switch (typeof value) {
    case 'boolean':
      return shouldAttributeAcceptBooleanValue(name);
    case 'undefined':
    case 'number':
    case 'string':
    case 'object':
      return true;
    default:
      // function, symbol
      return false;
  }
}

function getPropertyInfo(name) {
  return properties.hasOwnProperty(name) ? properties[name] : null;
}

function shouldAttributeAcceptBooleanValue(name) {
  if (isReservedProp(name)) {
    return true;
  }
  var propertyInfo = getPropertyInfo(name);
  if (propertyInfo) {
    return propertyInfo.hasBooleanValue || propertyInfo.hasStringBooleanValue || propertyInfo.hasOverloadedBooleanValue;
  }
  var prefix = name.toLowerCase().slice(0, 5);
  return prefix === 'data-' || prefix === 'aria-';
}

/**
 * Checks to see if a property name is within the list of properties
 * reserved for internal React operations. These properties should
 * not be set on an HTML element.
 *
 * @private
 * @param {string} name
 * @return {boolean} If the name is within reserved props
 */
function isReservedProp(name) {
  return RESERVED_PROPS.hasOwnProperty(name);
}

var injection = DOMPropertyInjection;

var MUST_USE_PROPERTY = injection.MUST_USE_PROPERTY;
var HAS_BOOLEAN_VALUE = injection.HAS_BOOLEAN_VALUE;
var HAS_NUMERIC_VALUE = injection.HAS_NUMERIC_VALUE;
var HAS_POSITIVE_NUMERIC_VALUE = injection.HAS_POSITIVE_NUMERIC_VALUE;
var HAS_OVERLOADED_BOOLEAN_VALUE = injection.HAS_OVERLOADED_BOOLEAN_VALUE;
var HAS_STRING_BOOLEAN_VALUE = injection.HAS_STRING_BOOLEAN_VALUE;

var HTMLDOMPropertyConfig = {
  // When adding attributes to this list, be sure to also add them to
  // the `possibleStandardNames` module to ensure casing and incorrect
  // name warnings.
  Properties: {
    allowFullScreen: HAS_BOOLEAN_VALUE,
    // specifies target context for links with `preload` type
    async: HAS_BOOLEAN_VALUE,
    // Note: there is a special case that prevents it from being written to the DOM
    // on the client side because the browsers are inconsistent. Instead we call focus().
    autoFocus: HAS_BOOLEAN_VALUE,
    autoPlay: HAS_BOOLEAN_VALUE,
    capture: HAS_OVERLOADED_BOOLEAN_VALUE,
    checked: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    cols: HAS_POSITIVE_NUMERIC_VALUE,
    contentEditable: HAS_STRING_BOOLEAN_VALUE,
    controls: HAS_BOOLEAN_VALUE,
    'default': HAS_BOOLEAN_VALUE,
    defer: HAS_BOOLEAN_VALUE,
    disabled: HAS_BOOLEAN_VALUE,
    download: HAS_OVERLOADED_BOOLEAN_VALUE,
    draggable: HAS_STRING_BOOLEAN_VALUE,
    formNoValidate: HAS_BOOLEAN_VALUE,
    hidden: HAS_BOOLEAN_VALUE,
    loop: HAS_BOOLEAN_VALUE,
    // Caution; `option.selected` is not updated if `select.multiple` is
    // disabled with `removeAttribute`.
    multiple: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    muted: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    noValidate: HAS_BOOLEAN_VALUE,
    open: HAS_BOOLEAN_VALUE,
    playsInline: HAS_BOOLEAN_VALUE,
    readOnly: HAS_BOOLEAN_VALUE,
    required: HAS_BOOLEAN_VALUE,
    reversed: HAS_BOOLEAN_VALUE,
    rows: HAS_POSITIVE_NUMERIC_VALUE,
    rowSpan: HAS_NUMERIC_VALUE,
    scoped: HAS_BOOLEAN_VALUE,
    seamless: HAS_BOOLEAN_VALUE,
    selected: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    size: HAS_POSITIVE_NUMERIC_VALUE,
    start: HAS_NUMERIC_VALUE,
    // support for projecting regular DOM Elements via V1 named slots ( shadow dom )
    span: HAS_POSITIVE_NUMERIC_VALUE,
    spellCheck: HAS_STRING_BOOLEAN_VALUE,
    // Style must be explicitly set in the attribute list. React components
    // expect a style object
    style: 0,
    // Keep it in the whitelist because it is case-sensitive for SVG.
    tabIndex: 0,
    // itemScope is for for Microdata support.
    // See http://schema.org/docs/gs.html
    itemScope: HAS_BOOLEAN_VALUE,
    // These attributes must stay in the white-list because they have
    // different attribute names (see DOMAttributeNames below)
    acceptCharset: 0,
    className: 0,
    htmlFor: 0,
    httpEquiv: 0,
    // Attributes with mutation methods must be specified in the whitelist
    // Set the string boolean flag to allow the behavior
    value: HAS_STRING_BOOLEAN_VALUE
  },
  DOMAttributeNames: {
    acceptCharset: 'accept-charset',
    className: 'class',
    htmlFor: 'for',
    httpEquiv: 'http-equiv'
  },
  DOMMutationMethods: {
    value: function (node, value) {
      if (value == null) {
        return node.removeAttribute('value');
      }

      // Number inputs get special treatment due to some edge cases in
      // Chrome. Let everything else assign the value attribute as normal.
      // https://github.com/facebook/react/issues/7253#issuecomment-236074326
      if (node.type !== 'number' || node.hasAttribute('value') === false) {
        node.setAttribute('value', '' + value);
      } else if (node.validity && !node.validity.badInput && node.ownerDocument.activeElement !== node) {
        // Don't assign an attribute if validation reports bad
        // input. Chrome will clear the value. Additionally, don't
        // operate on inputs that have focus, otherwise Chrome might
        // strip off trailing decimal places and cause the user's
        // cursor position to jump to the beginning of the input.
        //
        // In ReactDOMInput, we have an onBlur event that will trigger
        // this function again when focus is lost.
        node.setAttribute('value', '' + value);
      }
    }
  }
};

var HAS_STRING_BOOLEAN_VALUE$1 = injection.HAS_STRING_BOOLEAN_VALUE;


var NS = {
  xlink: 'http://www.w3.org/1999/xlink',
  xml: 'http://www.w3.org/XML/1998/namespace'
};

/**
 * This is a list of all SVG attributes that need special casing,
 * namespacing, or boolean value assignment.
 *
 * When adding attributes to this list, be sure to also add them to
 * the `possibleStandardNames` module to ensure casing and incorrect
 * name warnings.
 *
 * SVG Attributes List:
 * https://www.w3.org/TR/SVG/attindex.html
 * SMIL Spec:
 * https://www.w3.org/TR/smil
 */
var ATTRS = ['accent-height', 'alignment-baseline', 'arabic-form', 'baseline-shift', 'cap-height', 'clip-path', 'clip-rule', 'color-interpolation', 'color-interpolation-filters', 'color-profile', 'color-rendering', 'dominant-baseline', 'enable-background', 'fill-opacity', 'fill-rule', 'flood-color', 'flood-opacity', 'font-family', 'font-size', 'font-size-adjust', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'glyph-name', 'glyph-orientation-horizontal', 'glyph-orientation-vertical', 'horiz-adv-x', 'horiz-origin-x', 'image-rendering', 'letter-spacing', 'lighting-color', 'marker-end', 'marker-mid', 'marker-start', 'overline-position', 'overline-thickness', 'paint-order', 'panose-1', 'pointer-events', 'rendering-intent', 'shape-rendering', 'stop-color', 'stop-opacity', 'strikethrough-position', 'strikethrough-thickness', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke-width', 'text-anchor', 'text-decoration', 'text-rendering', 'underline-position', 'underline-thickness', 'unicode-bidi', 'unicode-range', 'units-per-em', 'v-alphabetic', 'v-hanging', 'v-ideographic', 'v-mathematical', 'vector-effect', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'word-spacing', 'writing-mode', 'x-height', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xmlns:xlink', 'xml:lang', 'xml:space'];

var SVGDOMPropertyConfig = {
  Properties: {
    autoReverse: HAS_STRING_BOOLEAN_VALUE$1,
    externalResourcesRequired: HAS_STRING_BOOLEAN_VALUE$1,
    preserveAlpha: HAS_STRING_BOOLEAN_VALUE$1
  },
  DOMAttributeNames: {
    autoReverse: 'autoReverse',
    externalResourcesRequired: 'externalResourcesRequired',
    preserveAlpha: 'preserveAlpha'
  },
  DOMAttributeNamespaces: {
    xlinkActuate: NS.xlink,
    xlinkArcrole: NS.xlink,
    xlinkHref: NS.xlink,
    xlinkRole: NS.xlink,
    xlinkShow: NS.xlink,
    xlinkTitle: NS.xlink,
    xlinkType: NS.xlink,
    xmlBase: NS.xml,
    xmlLang: NS.xml,
    xmlSpace: NS.xml
  }
};

var CAMELIZE = /[\-\:]([a-z])/g;
var capitalize = function (token) {
  return token[1].toUpperCase();
};

ATTRS.forEach(function (original) {
  var reactName = original.replace(CAMELIZE, capitalize);

  SVGDOMPropertyConfig.Properties[reactName] = 0;
  SVGDOMPropertyConfig.DOMAttributeNames[reactName] = original;
});

injection.injectDOMPropertyConfig(HTMLDOMPropertyConfig);
injection.injectDOMPropertyConfig(SVGDOMPropertyConfig);

// TODO: this is special because it gets imported during build.

var ReactVersion = '16.2.0';

var describeComponentFrame = function (name, source, ownerName) {
  return '\n    in ' + (name || 'Unknown') + (source ? ' (at ' + source.fileName.replace(/^.*[\\\/]/, '') + ':' + source.lineNumber + ')' : ownerName ? ' (created by ' + ownerName + ')' : '');
};

var ReactInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

var ReactCurrentOwner = ReactInternals.ReactCurrentOwner;
var ReactDebugCurrentFrame = ReactInternals.ReactDebugCurrentFrame;

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === 'function' && Symbol['for'];





var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol['for']('react.fragment') : 0xeacb;

// code copied and modified from escape-html
/**
 * Module variables.
 * @private
 */

var matchHtmlRegExp = /["'&<>]/;

/**
 * Escapes special characters and HTML entities in a given html string.
 *
 * @param  {string} string HTML string to escape for later insertion
 * @return {string}
 * @public
 */

function escapeHtml(string) {
  var str = '' + string;
  var match = matchHtmlRegExp.exec(str);

  if (!match) {
    return str;
  }

  var escape;
  var html = '';
  var index = 0;
  var lastIndex = 0;

  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34:
        // "
        escape = '&quot;';
        break;
      case 38:
        // &
        escape = '&amp;';
        break;
      case 39:
        // '
        escape = '&#x27;'; // modified from escape-html; used to be '&#39'
        break;
      case 60:
        // <
        escape = '&lt;';
        break;
      case 62:
        // >
        escape = '&gt;';
        break;
      default:
        continue;
    }

    if (lastIndex !== index) {
      html += str.substring(lastIndex, index);
    }

    lastIndex = index + 1;
    html += escape;
  }

  return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
}
// end code copied and modified from escape-html

/**
 * Escapes text to prevent scripting attacks.
 *
 * @param {*} text Text value to escape.
 * @return {string} An escaped string.
 */
function escapeTextForBrowser(text) {
  if (typeof text === 'boolean' || typeof text === 'number') {
    // this shortcircuit helps perf for types that we know will never have
    // special characters, especially given that this function is used often
    // for numeric dom ids.
    return '' + text;
  }
  return escapeHtml(text);
}

/**
 * Escapes attribute value to prevent scripting attacks.
 *
 * @param {*} value Value to escape.
 * @return {string} An escaped string.
 */
function quoteAttributeValueForBrowser(value) {
  return '"' + escapeTextForBrowser(value) + '"';
}

// isAttributeNameSafe() is currently duplicated in DOMPropertyOperations.
// TODO: Find a better place for this.
var VALID_ATTRIBUTE_NAME_REGEX = new RegExp('^[' + ATTRIBUTE_NAME_START_CHAR + '][' + ATTRIBUTE_NAME_CHAR + ']*$');
var illegalAttributeNameCache = {};
var validatedAttributeNameCache = {};
function isAttributeNameSafe(attributeName) {
  if (validatedAttributeNameCache.hasOwnProperty(attributeName)) {
    return true;
  }
  if (illegalAttributeNameCache.hasOwnProperty(attributeName)) {
    return false;
  }
  if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName)) {
    validatedAttributeNameCache[attributeName] = true;
    return true;
  }
  illegalAttributeNameCache[attributeName] = true;
  {
    warning(false, 'Invalid attribute name: `%s`', attributeName);
  }
  return false;
}

// shouldIgnoreValue() is currently duplicated in DOMPropertyOperations.
// TODO: Find a better place for this.
function shouldIgnoreValue(propertyInfo, value) {
  return value == null || propertyInfo.hasBooleanValue && !value || propertyInfo.hasNumericValue && isNaN(value) || propertyInfo.hasPositiveNumericValue && value < 1 || propertyInfo.hasOverloadedBooleanValue && value === false;
}

/**
 * Operations for dealing with DOM properties.
 */

/**
 * Creates markup for the ID property.
 *
 * @param {string} id Unescaped ID.
 * @return {string} Markup string.
 */


function createMarkupForRoot() {
  return ROOT_ATTRIBUTE_NAME + '=""';
}

/**
 * Creates markup for a property.
 *
 * @param {string} name
 * @param {*} value
 * @return {?string} Markup string, or null if the property was invalid.
 */
function createMarkupForProperty(name, value) {
  var propertyInfo = getPropertyInfo(name);
  if (propertyInfo) {
    if (shouldIgnoreValue(propertyInfo, value)) {
      return '';
    }
    var attributeName = propertyInfo.attributeName;
    if (propertyInfo.hasBooleanValue || propertyInfo.hasOverloadedBooleanValue && value === true) {
      return attributeName + '=""';
    } else if (typeof value !== 'boolean' || shouldAttributeAcceptBooleanValue(name)) {
      return attributeName + '=' + quoteAttributeValueForBrowser(value);
    }
  } else if (shouldSetAttribute(name, value)) {
    if (value == null) {
      return '';
    }
    return name + '=' + quoteAttributeValueForBrowser(value);
  }
  return null;
}

/**
 * Creates markup for a custom property.
 *
 * @param {string} name
 * @param {*} value
 * @return {string} Markup string, or empty string if the property was invalid.
 */
function createMarkupForCustomAttribute(name, value) {
  if (!isAttributeNameSafe(name) || value == null) {
    return '';
  }
  return name + '=' + quoteAttributeValueForBrowser(value);
}

var HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';
var MATH_NAMESPACE = 'http://www.w3.org/1998/Math/MathML';
var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

var Namespaces = {
  html: HTML_NAMESPACE,
  mathml: MATH_NAMESPACE,
  svg: SVG_NAMESPACE
};

// Assumes there is no parent namespace.
function getIntrinsicNamespace(type) {
  switch (type) {
    case 'svg':
      return SVG_NAMESPACE;
    case 'math':
      return MATH_NAMESPACE;
    default:
      return HTML_NAMESPACE;
  }
}

function getChildNamespace(parentNamespace, type) {
  if (parentNamespace == null || parentNamespace === HTML_NAMESPACE) {
    // No (or default) parent namespace: potential entry point.
    return getIntrinsicNamespace(type);
  }
  if (parentNamespace === SVG_NAMESPACE && type === 'foreignObject') {
    // We're leaving SVG.
    return HTML_NAMESPACE;
  }
  // By default, pass namespace below.
  return parentNamespace;
}

var ReactControlledValuePropTypes = {
  checkPropTypes: null
};

{
  var hasReadOnlyValue = {
    button: true,
    checkbox: true,
    image: true,
    hidden: true,
    radio: true,
    reset: true,
    submit: true
  };

  var propTypes = {
    value: function (props, propName, componentName) {
      if (!props[propName] || hasReadOnlyValue[props.type] || props.onChange || props.readOnly || props.disabled) {
        return null;
      }
      return new Error('You provided a `value` prop to a form field without an ' + '`onChange` handler. This will render a read-only field. If ' + 'the field should be mutable use `defaultValue`. Otherwise, ' + 'set either `onChange` or `readOnly`.');
    },
    checked: function (props, propName, componentName) {
      if (!props[propName] || props.onChange || props.readOnly || props.disabled) {
        return null;
      }
      return new Error('You provided a `checked` prop to a form field without an ' + '`onChange` handler. This will render a read-only field. If ' + 'the field should be mutable use `defaultChecked`. Otherwise, ' + 'set either `onChange` or `readOnly`.');
    }
  };

  /**
   * Provide a linked `value` attribute for controlled forms. You should not use
   * this outside of the ReactDOM controlled form components.
   */
  ReactControlledValuePropTypes.checkPropTypes = function (tagName, props, getStack) {
    checkPropTypes(propTypes, props, 'prop', tagName, getStack);
  };
}

// For HTML, certain tags should omit their close tag. We keep a whitelist for
// those special-case tags.

var omittedCloseTags = {
  area: true,
  base: true,
  br: true,
  col: true,
  embed: true,
  hr: true,
  img: true,
  input: true,
  keygen: true,
  link: true,
  meta: true,
  param: true,
  source: true,
  track: true,
  wbr: true
};

// For HTML, certain tags cannot have children. This has the same purpose as
// `omittedCloseTags` except that `menuitem` should still have its closing tag.

var voidElementTags = _assign({
  menuitem: true
}, omittedCloseTags);

var HTML = '__html';

function assertValidProps(tag, props, getStack) {
  if (!props) {
    return;
  }
  // Note the use of `==` which checks for null or undefined.
  if (voidElementTags[tag]) {
    !(props.children == null && props.dangerouslySetInnerHTML == null) ? invariant(false, '%s is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.%s', tag, getStack()) : void 0;
  }
  if (props.dangerouslySetInnerHTML != null) {
    !(props.children == null) ? invariant(false, 'Can only set one of `children` or `props.dangerouslySetInnerHTML`.') : void 0;
    !(typeof props.dangerouslySetInnerHTML === 'object' && HTML in props.dangerouslySetInnerHTML) ? invariant(false, '`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://fb.me/react-invariant-dangerously-set-inner-html for more information.') : void 0;
  }
  {
    warning(props.suppressContentEditableWarning || !props.contentEditable || props.children == null, 'A component is `contentEditable` and contains `children` managed by ' + 'React. It is now your responsibility to guarantee that none of ' + 'those nodes are unexpectedly modified or duplicated. This is ' + 'probably not intentional.%s', getStack());
  }
  !(props.style == null || typeof props.style === 'object') ? invariant(false, 'The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + \'em\'}} when using JSX.%s', getStack()) : void 0;
}

/**
 * CSS properties which accept numbers but are not in units of "px".
 */
var isUnitlessNumber = {
  animationIterationCount: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,

  // SVG-related properties
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
};

/**
 * @param {string} prefix vendor-specific prefix, eg: Webkit
 * @param {string} key style name, eg: transitionDuration
 * @return {string} style name prefixed with `prefix`, properly camelCased, eg:
 * WebkitTransitionDuration
 */
function prefixKey(prefix, key) {
  return prefix + key.charAt(0).toUpperCase() + key.substring(1);
}

/**
 * Support style names that may come passed in prefixed by adding permutations
 * of vendor prefixes.
 */
var prefixes = ['Webkit', 'ms', 'Moz', 'O'];

// Using Object.keys here, or else the vanilla for-in loop makes IE8 go into an
// infinite loop, because it iterates over the newly added props too.
Object.keys(isUnitlessNumber).forEach(function (prop) {
  prefixes.forEach(function (prefix) {
    isUnitlessNumber[prefixKey(prefix, prop)] = isUnitlessNumber[prop];
  });
});

/**
 * Convert a value into the proper css writable value. The style name `name`
 * should be logical (no hyphens), as specified
 * in `CSSProperty.isUnitlessNumber`.
 *
 * @param {string} name CSS property name such as `topMargin`.
 * @param {*} value CSS property value such as `10px`.
 * @return {string} Normalized style value with dimensions applied.
 */
function dangerousStyleValue(name, value, isCustomProperty) {
  // Note that we've removed escapeTextForBrowser() calls here since the
  // whole string will be escaped when the attribute is injected into
  // the markup. If you provide unsafe user data here they can inject
  // arbitrary CSS which may be problematic (I couldn't repro this):
  // https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
  // http://www.thespanner.co.uk/2007/11/26/ultimate-xss-css-injection/
  // This is not an XSS hole but instead a potential CSS injection issue
  // which has lead to a greater discussion about how we're going to
  // trust URLs moving forward. See #2115901

  var isEmpty = value == null || typeof value === 'boolean' || value === '';
  if (isEmpty) {
    return '';
  }

  if (!isCustomProperty && typeof value === 'number' && value !== 0 && !(isUnitlessNumber.hasOwnProperty(name) && isUnitlessNumber[name])) {
    return value + 'px'; // Presumes implicit 'px' suffix for unitless numbers
  }

  return ('' + value).trim();
}

function isCustomComponent(tagName, props) {
  if (tagName.indexOf('-') === -1) {
    return typeof props.is === 'string';
  }
  switch (tagName) {
    // These are reserved SVG and MathML elements.
    // We don't mind this whitelist too much because we expect it to never grow.
    // The alternative is to track the namespace in a few places which is convoluted.
    // https://w3c.github.io/webcomponents/spec/custom/#custom-elements-core-concepts
    case 'annotation-xml':
    case 'color-profile':
    case 'font-face':
    case 'font-face-src':
    case 'font-face-uri':
    case 'font-face-format':
    case 'font-face-name':
    case 'missing-glyph':
      return false;
    default:
      return true;
  }
}

var warnValidStyle = emptyFunction;

{
  // 'msTransform' is correct, but the other prefixes should be capitalized
  var badVendoredStyleNamePattern = /^(?:webkit|moz|o)[A-Z]/;

  // style values shouldn't contain a semicolon
  var badStyleValueWithSemicolonPattern = /;\s*$/;

  var warnedStyleNames = {};
  var warnedStyleValues = {};
  var warnedForNaNValue = false;
  var warnedForInfinityValue = false;

  var warnHyphenatedStyleName = function (name, getStack) {
    if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
      return;
    }

    warnedStyleNames[name] = true;
    warning(false, 'Unsupported style property %s. Did you mean %s?%s', name, camelizeStyleName(name), getStack());
  };

  var warnBadVendoredStyleName = function (name, getStack) {
    if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
      return;
    }

    warnedStyleNames[name] = true;
    warning(false, 'Unsupported vendor-prefixed style property %s. Did you mean %s?%s', name, name.charAt(0).toUpperCase() + name.slice(1), getStack());
  };

  var warnStyleValueWithSemicolon = function (name, value, getStack) {
    if (warnedStyleValues.hasOwnProperty(value) && warnedStyleValues[value]) {
      return;
    }

    warnedStyleValues[value] = true;
    warning(false, "Style property values shouldn't contain a semicolon. " + 'Try "%s: %s" instead.%s', name, value.replace(badStyleValueWithSemicolonPattern, ''), getStack());
  };

  var warnStyleValueIsNaN = function (name, value, getStack) {
    if (warnedForNaNValue) {
      return;
    }

    warnedForNaNValue = true;
    warning(false, '`NaN` is an invalid value for the `%s` css style property.%s', name, getStack());
  };

  var warnStyleValueIsInfinity = function (name, value, getStack) {
    if (warnedForInfinityValue) {
      return;
    }

    warnedForInfinityValue = true;
    warning(false, '`Infinity` is an invalid value for the `%s` css style property.%s', name, getStack());
  };

  warnValidStyle = function (name, value, getStack) {
    if (name.indexOf('-') > -1) {
      warnHyphenatedStyleName(name, getStack);
    } else if (badVendoredStyleNamePattern.test(name)) {
      warnBadVendoredStyleName(name, getStack);
    } else if (badStyleValueWithSemicolonPattern.test(value)) {
      warnStyleValueWithSemicolon(name, value, getStack);
    }

    if (typeof value === 'number') {
      if (isNaN(value)) {
        warnStyleValueIsNaN(name, value, getStack);
      } else if (!isFinite(value)) {
        warnStyleValueIsInfinity(name, value, getStack);
      }
    }
  };
}

var warnValidStyle$1 = warnValidStyle;

var ariaProperties = {
  'aria-current': 0, // state
  'aria-details': 0,
  'aria-disabled': 0, // state
  'aria-hidden': 0, // state
  'aria-invalid': 0, // state
  'aria-keyshortcuts': 0,
  'aria-label': 0,
  'aria-roledescription': 0,
  // Widget Attributes
  'aria-autocomplete': 0,
  'aria-checked': 0,
  'aria-expanded': 0,
  'aria-haspopup': 0,
  'aria-level': 0,
  'aria-modal': 0,
  'aria-multiline': 0,
  'aria-multiselectable': 0,
  'aria-orientation': 0,
  'aria-placeholder': 0,
  'aria-pressed': 0,
  'aria-readonly': 0,
  'aria-required': 0,
  'aria-selected': 0,
  'aria-sort': 0,
  'aria-valuemax': 0,
  'aria-valuemin': 0,
  'aria-valuenow': 0,
  'aria-valuetext': 0,
  // Live Region Attributes
  'aria-atomic': 0,
  'aria-busy': 0,
  'aria-live': 0,
  'aria-relevant': 0,
  // Drag-and-Drop Attributes
  'aria-dropeffect': 0,
  'aria-grabbed': 0,
  // Relationship Attributes
  'aria-activedescendant': 0,
  'aria-colcount': 0,
  'aria-colindex': 0,
  'aria-colspan': 0,
  'aria-controls': 0,
  'aria-describedby': 0,
  'aria-errormessage': 0,
  'aria-flowto': 0,
  'aria-labelledby': 0,
  'aria-owns': 0,
  'aria-posinset': 0,
  'aria-rowcount': 0,
  'aria-rowindex': 0,
  'aria-rowspan': 0,
  'aria-setsize': 0
};

var warnedProperties = {};
var rARIA = new RegExp('^(aria)-[' + ATTRIBUTE_NAME_CHAR + ']*$');
var rARIACamel = new RegExp('^(aria)[A-Z][' + ATTRIBUTE_NAME_CHAR + ']*$');

var hasOwnProperty = Object.prototype.hasOwnProperty;

function getStackAddendum$1() {
  var stack = ReactDebugCurrentFrame.getStackAddendum();
  return stack != null ? stack : '';
}

function validateProperty(tagName, name) {
  if (hasOwnProperty.call(warnedProperties, name) && warnedProperties[name]) {
    return true;
  }

  if (rARIACamel.test(name)) {
    var ariaName = 'aria-' + name.slice(4).toLowerCase();
    var correctName = ariaProperties.hasOwnProperty(ariaName) ? ariaName : null;

    // If this is an aria-* attribute, but is not listed in the known DOM
    // DOM properties, then it is an invalid aria-* attribute.
    if (correctName == null) {
      warning(false, 'Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.%s', name, getStackAddendum$1());
      warnedProperties[name] = true;
      return true;
    }
    // aria-* attributes should be lowercase; suggest the lowercase version.
    if (name !== correctName) {
      warning(false, 'Invalid ARIA attribute `%s`. Did you mean `%s`?%s', name, correctName, getStackAddendum$1());
      warnedProperties[name] = true;
      return true;
    }
  }

  if (rARIA.test(name)) {
    var lowerCasedName = name.toLowerCase();
    var standardName = ariaProperties.hasOwnProperty(lowerCasedName) ? lowerCasedName : null;

    // If this is an aria-* attribute, but is not listed in the known DOM
    // DOM properties, then it is an invalid aria-* attribute.
    if (standardName == null) {
      warnedProperties[name] = true;
      return false;
    }
    // aria-* attributes should be lowercase; suggest the lowercase version.
    if (name !== standardName) {
      warning(false, 'Unknown ARIA attribute `%s`. Did you mean `%s`?%s', name, standardName, getStackAddendum$1());
      warnedProperties[name] = true;
      return true;
    }
  }

  return true;
}

function warnInvalidARIAProps(type, props) {
  var invalidProps = [];

  for (var key in props) {
    var isValid = validateProperty(type, key);
    if (!isValid) {
      invalidProps.push(key);
    }
  }

  var unknownPropString = invalidProps.map(function (prop) {
    return '`' + prop + '`';
  }).join(', ');

  if (invalidProps.length === 1) {
    warning(false, 'Invalid aria prop %s on <%s> tag. ' + 'For details, see https://fb.me/invalid-aria-prop%s', unknownPropString, type, getStackAddendum$1());
  } else if (invalidProps.length > 1) {
    warning(false, 'Invalid aria props %s on <%s> tag. ' + 'For details, see https://fb.me/invalid-aria-prop%s', unknownPropString, type, getStackAddendum$1());
  }
}

function validateProperties(type, props) {
  if (isCustomComponent(type, props)) {
    return;
  }
  warnInvalidARIAProps(type, props);
}

var didWarnValueNull = false;

function getStackAddendum$2() {
  var stack = ReactDebugCurrentFrame.getStackAddendum();
  return stack != null ? stack : '';
}

function validateProperties$1(type, props) {
  if (type !== 'input' && type !== 'textarea' && type !== 'select') {
    return;
  }

  if (props != null && props.value === null && !didWarnValueNull) {
    didWarnValueNull = true;
    if (type === 'select' && props.multiple) {
      warning(false, '`value` prop on `%s` should not be null. ' + 'Consider using an empty array when `multiple` is set to `true` ' + 'to clear the component or `undefined` for uncontrolled components.%s', type, getStackAddendum$2());
    } else {
      warning(false, '`value` prop on `%s` should not be null. ' + 'Consider using an empty string to clear the component or `undefined` ' + 'for uncontrolled components.%s', type, getStackAddendum$2());
    }
  }
}

/**
 * Registers plugins so that they can extract and dispatch events.
 *
 * @see {EventPluginHub}
 */

/**
 * Ordered list of injected plugins.
 */


/**
 * Mapping from event name to dispatch config
 */


/**
 * Mapping from registration name to plugin module
 */
var registrationNameModules = {};

/**
 * Mapping from registration name to event name
 */


/**
 * Mapping from lowercase registration names to the properly cased version,
 * used to warn in the case of missing event handlers. Available
 * only in true.
 * @type {Object}
 */
var possibleRegistrationNames = {};
// Trust the developer to only use possibleRegistrationNames in true

/**
 * Injects an ordering of plugins (by plugin name). This allows the ordering
 * to be decoupled from injection of the actual plugins so that ordering is
 * always deterministic regardless of packaging, on-the-fly injection, etc.
 *
 * @param {array} InjectedEventPluginOrder
 * @internal
 * @see {EventPluginHub.injection.injectEventPluginOrder}
 */


/**
 * Injects plugins to be used by `EventPluginHub`. The plugin names must be
 * in the ordering injected by `injectEventPluginOrder`.
 *
 * Plugins can be injected as part of page initialization or on-the-fly.
 *
 * @param {object} injectedNamesToPlugins Map from names to plugin modules.
 * @internal
 * @see {EventPluginHub.injection.injectEventPluginsByName}
 */

// When adding attributes to the HTML or SVG whitelist, be sure to
// also add them to this module to ensure casing and incorrect name
// warnings.
var possibleStandardNames = {
  // HTML
  accept: 'accept',
  acceptcharset: 'acceptCharset',
  'accept-charset': 'acceptCharset',
  accesskey: 'accessKey',
  action: 'action',
  allowfullscreen: 'allowFullScreen',
  alt: 'alt',
  as: 'as',
  async: 'async',
  autocapitalize: 'autoCapitalize',
  autocomplete: 'autoComplete',
  autocorrect: 'autoCorrect',
  autofocus: 'autoFocus',
  autoplay: 'autoPlay',
  autosave: 'autoSave',
  capture: 'capture',
  cellpadding: 'cellPadding',
  cellspacing: 'cellSpacing',
  challenge: 'challenge',
  charset: 'charSet',
  checked: 'checked',
  children: 'children',
  cite: 'cite',
  'class': 'className',
  classid: 'classID',
  classname: 'className',
  cols: 'cols',
  colspan: 'colSpan',
  content: 'content',
  contenteditable: 'contentEditable',
  contextmenu: 'contextMenu',
  controls: 'controls',
  controlslist: 'controlsList',
  coords: 'coords',
  crossorigin: 'crossOrigin',
  dangerouslysetinnerhtml: 'dangerouslySetInnerHTML',
  data: 'data',
  datetime: 'dateTime',
  'default': 'default',
  defaultchecked: 'defaultChecked',
  defaultvalue: 'defaultValue',
  defer: 'defer',
  dir: 'dir',
  disabled: 'disabled',
  download: 'download',
  draggable: 'draggable',
  enctype: 'encType',
  'for': 'htmlFor',
  form: 'form',
  formmethod: 'formMethod',
  formaction: 'formAction',
  formenctype: 'formEncType',
  formnovalidate: 'formNoValidate',
  formtarget: 'formTarget',
  frameborder: 'frameBorder',
  headers: 'headers',
  height: 'height',
  hidden: 'hidden',
  high: 'high',
  href: 'href',
  hreflang: 'hrefLang',
  htmlfor: 'htmlFor',
  httpequiv: 'httpEquiv',
  'http-equiv': 'httpEquiv',
  icon: 'icon',
  id: 'id',
  innerhtml: 'innerHTML',
  inputmode: 'inputMode',
  integrity: 'integrity',
  is: 'is',
  itemid: 'itemID',
  itemprop: 'itemProp',
  itemref: 'itemRef',
  itemscope: 'itemScope',
  itemtype: 'itemType',
  keyparams: 'keyParams',
  keytype: 'keyType',
  kind: 'kind',
  label: 'label',
  lang: 'lang',
  list: 'list',
  loop: 'loop',
  low: 'low',
  manifest: 'manifest',
  marginwidth: 'marginWidth',
  marginheight: 'marginHeight',
  max: 'max',
  maxlength: 'maxLength',
  media: 'media',
  mediagroup: 'mediaGroup',
  method: 'method',
  min: 'min',
  minlength: 'minLength',
  multiple: 'multiple',
  muted: 'muted',
  name: 'name',
  nonce: 'nonce',
  novalidate: 'noValidate',
  open: 'open',
  optimum: 'optimum',
  pattern: 'pattern',
  placeholder: 'placeholder',
  playsinline: 'playsInline',
  poster: 'poster',
  preload: 'preload',
  profile: 'profile',
  radiogroup: 'radioGroup',
  readonly: 'readOnly',
  referrerpolicy: 'referrerPolicy',
  rel: 'rel',
  required: 'required',
  reversed: 'reversed',
  role: 'role',
  rows: 'rows',
  rowspan: 'rowSpan',
  sandbox: 'sandbox',
  scope: 'scope',
  scoped: 'scoped',
  scrolling: 'scrolling',
  seamless: 'seamless',
  selected: 'selected',
  shape: 'shape',
  size: 'size',
  sizes: 'sizes',
  span: 'span',
  spellcheck: 'spellCheck',
  src: 'src',
  srcdoc: 'srcDoc',
  srclang: 'srcLang',
  srcset: 'srcSet',
  start: 'start',
  step: 'step',
  style: 'style',
  summary: 'summary',
  tabindex: 'tabIndex',
  target: 'target',
  title: 'title',
  type: 'type',
  usemap: 'useMap',
  value: 'value',
  width: 'width',
  wmode: 'wmode',
  wrap: 'wrap',

  // SVG
  about: 'about',
  accentheight: 'accentHeight',
  'accent-height': 'accentHeight',
  accumulate: 'accumulate',
  additive: 'additive',
  alignmentbaseline: 'alignmentBaseline',
  'alignment-baseline': 'alignmentBaseline',
  allowreorder: 'allowReorder',
  alphabetic: 'alphabetic',
  amplitude: 'amplitude',
  arabicform: 'arabicForm',
  'arabic-form': 'arabicForm',
  ascent: 'ascent',
  attributename: 'attributeName',
  attributetype: 'attributeType',
  autoreverse: 'autoReverse',
  azimuth: 'azimuth',
  basefrequency: 'baseFrequency',
  baselineshift: 'baselineShift',
  'baseline-shift': 'baselineShift',
  baseprofile: 'baseProfile',
  bbox: 'bbox',
  begin: 'begin',
  bias: 'bias',
  by: 'by',
  calcmode: 'calcMode',
  capheight: 'capHeight',
  'cap-height': 'capHeight',
  clip: 'clip',
  clippath: 'clipPath',
  'clip-path': 'clipPath',
  clippathunits: 'clipPathUnits',
  cliprule: 'clipRule',
  'clip-rule': 'clipRule',
  color: 'color',
  colorinterpolation: 'colorInterpolation',
  'color-interpolation': 'colorInterpolation',
  colorinterpolationfilters: 'colorInterpolationFilters',
  'color-interpolation-filters': 'colorInterpolationFilters',
  colorprofile: 'colorProfile',
  'color-profile': 'colorProfile',
  colorrendering: 'colorRendering',
  'color-rendering': 'colorRendering',
  contentscripttype: 'contentScriptType',
  contentstyletype: 'contentStyleType',
  cursor: 'cursor',
  cx: 'cx',
  cy: 'cy',
  d: 'd',
  datatype: 'datatype',
  decelerate: 'decelerate',
  descent: 'descent',
  diffuseconstant: 'diffuseConstant',
  direction: 'direction',
  display: 'display',
  divisor: 'divisor',
  dominantbaseline: 'dominantBaseline',
  'dominant-baseline': 'dominantBaseline',
  dur: 'dur',
  dx: 'dx',
  dy: 'dy',
  edgemode: 'edgeMode',
  elevation: 'elevation',
  enablebackground: 'enableBackground',
  'enable-background': 'enableBackground',
  end: 'end',
  exponent: 'exponent',
  externalresourcesrequired: 'externalResourcesRequired',
  fill: 'fill',
  fillopacity: 'fillOpacity',
  'fill-opacity': 'fillOpacity',
  fillrule: 'fillRule',
  'fill-rule': 'fillRule',
  filter: 'filter',
  filterres: 'filterRes',
  filterunits: 'filterUnits',
  floodopacity: 'floodOpacity',
  'flood-opacity': 'floodOpacity',
  floodcolor: 'floodColor',
  'flood-color': 'floodColor',
  focusable: 'focusable',
  fontfamily: 'fontFamily',
  'font-family': 'fontFamily',
  fontsize: 'fontSize',
  'font-size': 'fontSize',
  fontsizeadjust: 'fontSizeAdjust',
  'font-size-adjust': 'fontSizeAdjust',
  fontstretch: 'fontStretch',
  'font-stretch': 'fontStretch',
  fontstyle: 'fontStyle',
  'font-style': 'fontStyle',
  fontvariant: 'fontVariant',
  'font-variant': 'fontVariant',
  fontweight: 'fontWeight',
  'font-weight': 'fontWeight',
  format: 'format',
  from: 'from',
  fx: 'fx',
  fy: 'fy',
  g1: 'g1',
  g2: 'g2',
  glyphname: 'glyphName',
  'glyph-name': 'glyphName',
  glyphorientationhorizontal: 'glyphOrientationHorizontal',
  'glyph-orientation-horizontal': 'glyphOrientationHorizontal',
  glyphorientationvertical: 'glyphOrientationVertical',
  'glyph-orientation-vertical': 'glyphOrientationVertical',
  glyphref: 'glyphRef',
  gradienttransform: 'gradientTransform',
  gradientunits: 'gradientUnits',
  hanging: 'hanging',
  horizadvx: 'horizAdvX',
  'horiz-adv-x': 'horizAdvX',
  horizoriginx: 'horizOriginX',
  'horiz-origin-x': 'horizOriginX',
  ideographic: 'ideographic',
  imagerendering: 'imageRendering',
  'image-rendering': 'imageRendering',
  in2: 'in2',
  'in': 'in',
  inlist: 'inlist',
  intercept: 'intercept',
  k1: 'k1',
  k2: 'k2',
  k3: 'k3',
  k4: 'k4',
  k: 'k',
  kernelmatrix: 'kernelMatrix',
  kernelunitlength: 'kernelUnitLength',
  kerning: 'kerning',
  keypoints: 'keyPoints',
  keysplines: 'keySplines',
  keytimes: 'keyTimes',
  lengthadjust: 'lengthAdjust',
  letterspacing: 'letterSpacing',
  'letter-spacing': 'letterSpacing',
  lightingcolor: 'lightingColor',
  'lighting-color': 'lightingColor',
  limitingconeangle: 'limitingConeAngle',
  local: 'local',
  markerend: 'markerEnd',
  'marker-end': 'markerEnd',
  markerheight: 'markerHeight',
  markermid: 'markerMid',
  'marker-mid': 'markerMid',
  markerstart: 'markerStart',
  'marker-start': 'markerStart',
  markerunits: 'markerUnits',
  markerwidth: 'markerWidth',
  mask: 'mask',
  maskcontentunits: 'maskContentUnits',
  maskunits: 'maskUnits',
  mathematical: 'mathematical',
  mode: 'mode',
  numoctaves: 'numOctaves',
  offset: 'offset',
  opacity: 'opacity',
  operator: 'operator',
  order: 'order',
  orient: 'orient',
  orientation: 'orientation',
  origin: 'origin',
  overflow: 'overflow',
  overlineposition: 'overlinePosition',
  'overline-position': 'overlinePosition',
  overlinethickness: 'overlineThickness',
  'overline-thickness': 'overlineThickness',
  paintorder: 'paintOrder',
  'paint-order': 'paintOrder',
  panose1: 'panose1',
  'panose-1': 'panose1',
  pathlength: 'pathLength',
  patterncontentunits: 'patternContentUnits',
  patterntransform: 'patternTransform',
  patternunits: 'patternUnits',
  pointerevents: 'pointerEvents',
  'pointer-events': 'pointerEvents',
  points: 'points',
  pointsatx: 'pointsAtX',
  pointsaty: 'pointsAtY',
  pointsatz: 'pointsAtZ',
  prefix: 'prefix',
  preservealpha: 'preserveAlpha',
  preserveaspectratio: 'preserveAspectRatio',
  primitiveunits: 'primitiveUnits',
  property: 'property',
  r: 'r',
  radius: 'radius',
  refx: 'refX',
  refy: 'refY',
  renderingintent: 'renderingIntent',
  'rendering-intent': 'renderingIntent',
  repeatcount: 'repeatCount',
  repeatdur: 'repeatDur',
  requiredextensions: 'requiredExtensions',
  requiredfeatures: 'requiredFeatures',
  resource: 'resource',
  restart: 'restart',
  result: 'result',
  results: 'results',
  rotate: 'rotate',
  rx: 'rx',
  ry: 'ry',
  scale: 'scale',
  security: 'security',
  seed: 'seed',
  shaperendering: 'shapeRendering',
  'shape-rendering': 'shapeRendering',
  slope: 'slope',
  spacing: 'spacing',
  specularconstant: 'specularConstant',
  specularexponent: 'specularExponent',
  speed: 'speed',
  spreadmethod: 'spreadMethod',
  startoffset: 'startOffset',
  stddeviation: 'stdDeviation',
  stemh: 'stemh',
  stemv: 'stemv',
  stitchtiles: 'stitchTiles',
  stopcolor: 'stopColor',
  'stop-color': 'stopColor',
  stopopacity: 'stopOpacity',
  'stop-opacity': 'stopOpacity',
  strikethroughposition: 'strikethroughPosition',
  'strikethrough-position': 'strikethroughPosition',
  strikethroughthickness: 'strikethroughThickness',
  'strikethrough-thickness': 'strikethroughThickness',
  string: 'string',
  stroke: 'stroke',
  strokedasharray: 'strokeDasharray',
  'stroke-dasharray': 'strokeDasharray',
  strokedashoffset: 'strokeDashoffset',
  'stroke-dashoffset': 'strokeDashoffset',
  strokelinecap: 'strokeLinecap',
  'stroke-linecap': 'strokeLinecap',
  strokelinejoin: 'strokeLinejoin',
  'stroke-linejoin': 'strokeLinejoin',
  strokemiterlimit: 'strokeMiterlimit',
  'stroke-miterlimit': 'strokeMiterlimit',
  strokewidth: 'strokeWidth',
  'stroke-width': 'strokeWidth',
  strokeopacity: 'strokeOpacity',
  'stroke-opacity': 'strokeOpacity',
  suppresscontenteditablewarning: 'suppressContentEditableWarning',
  suppresshydrationwarning: 'suppressHydrationWarning',
  surfacescale: 'surfaceScale',
  systemlanguage: 'systemLanguage',
  tablevalues: 'tableValues',
  targetx: 'targetX',
  targety: 'targetY',
  textanchor: 'textAnchor',
  'text-anchor': 'textAnchor',
  textdecoration: 'textDecoration',
  'text-decoration': 'textDecoration',
  textlength: 'textLength',
  textrendering: 'textRendering',
  'text-rendering': 'textRendering',
  to: 'to',
  transform: 'transform',
  'typeof': 'typeof',
  u1: 'u1',
  u2: 'u2',
  underlineposition: 'underlinePosition',
  'underline-position': 'underlinePosition',
  underlinethickness: 'underlineThickness',
  'underline-thickness': 'underlineThickness',
  unicode: 'unicode',
  unicodebidi: 'unicodeBidi',
  'unicode-bidi': 'unicodeBidi',
  unicoderange: 'unicodeRange',
  'unicode-range': 'unicodeRange',
  unitsperem: 'unitsPerEm',
  'units-per-em': 'unitsPerEm',
  unselectable: 'unselectable',
  valphabetic: 'vAlphabetic',
  'v-alphabetic': 'vAlphabetic',
  values: 'values',
  vectoreffect: 'vectorEffect',
  'vector-effect': 'vectorEffect',
  version: 'version',
  vertadvy: 'vertAdvY',
  'vert-adv-y': 'vertAdvY',
  vertoriginx: 'vertOriginX',
  'vert-origin-x': 'vertOriginX',
  vertoriginy: 'vertOriginY',
  'vert-origin-y': 'vertOriginY',
  vhanging: 'vHanging',
  'v-hanging': 'vHanging',
  videographic: 'vIdeographic',
  'v-ideographic': 'vIdeographic',
  viewbox: 'viewBox',
  viewtarget: 'viewTarget',
  visibility: 'visibility',
  vmathematical: 'vMathematical',
  'v-mathematical': 'vMathematical',
  vocab: 'vocab',
  widths: 'widths',
  wordspacing: 'wordSpacing',
  'word-spacing': 'wordSpacing',
  writingmode: 'writingMode',
  'writing-mode': 'writingMode',
  x1: 'x1',
  x2: 'x2',
  x: 'x',
  xchannelselector: 'xChannelSelector',
  xheight: 'xHeight',
  'x-height': 'xHeight',
  xlinkactuate: 'xlinkActuate',
  'xlink:actuate': 'xlinkActuate',
  xlinkarcrole: 'xlinkArcrole',
  'xlink:arcrole': 'xlinkArcrole',
  xlinkhref: 'xlinkHref',
  'xlink:href': 'xlinkHref',
  xlinkrole: 'xlinkRole',
  'xlink:role': 'xlinkRole',
  xlinkshow: 'xlinkShow',
  'xlink:show': 'xlinkShow',
  xlinktitle: 'xlinkTitle',
  'xlink:title': 'xlinkTitle',
  xlinktype: 'xlinkType',
  'xlink:type': 'xlinkType',
  xmlbase: 'xmlBase',
  'xml:base': 'xmlBase',
  xmllang: 'xmlLang',
  'xml:lang': 'xmlLang',
  xmlns: 'xmlns',
  'xml:space': 'xmlSpace',
  xmlnsxlink: 'xmlnsXlink',
  'xmlns:xlink': 'xmlnsXlink',
  xmlspace: 'xmlSpace',
  y1: 'y1',
  y2: 'y2',
  y: 'y',
  ychannelselector: 'yChannelSelector',
  z: 'z',
  zoomandpan: 'zoomAndPan'
};

function getStackAddendum$3() {
  var stack = ReactDebugCurrentFrame.getStackAddendum();
  return stack != null ? stack : '';
}

{
  var warnedProperties$1 = {};
  var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
  var EVENT_NAME_REGEX = /^on./;
  var INVALID_EVENT_NAME_REGEX = /^on[^A-Z]/;
  var rARIA$1 = new RegExp('^(aria)-[' + ATTRIBUTE_NAME_CHAR + ']*$');
  var rARIACamel$1 = new RegExp('^(aria)[A-Z][' + ATTRIBUTE_NAME_CHAR + ']*$');

  var validateProperty$1 = function (tagName, name, value, canUseEventSystem) {
    if (hasOwnProperty$1.call(warnedProperties$1, name) && warnedProperties$1[name]) {
      return true;
    }

    var lowerCasedName = name.toLowerCase();
    if (lowerCasedName === 'onfocusin' || lowerCasedName === 'onfocusout') {
      warning(false, 'React uses onFocus and onBlur instead of onFocusIn and onFocusOut. ' + 'All React events are normalized to bubble, so onFocusIn and onFocusOut ' + 'are not needed/supported by React.');
      warnedProperties$1[name] = true;
      return true;
    }

    // We can't rely on the event system being injected on the server.
    if (canUseEventSystem) {
      if (registrationNameModules.hasOwnProperty(name)) {
        return true;
      }
      var registrationName = possibleRegistrationNames.hasOwnProperty(lowerCasedName) ? possibleRegistrationNames[lowerCasedName] : null;
      if (registrationName != null) {
        warning(false, 'Invalid event handler property `%s`. Did you mean `%s`?%s', name, registrationName, getStackAddendum$3());
        warnedProperties$1[name] = true;
        return true;
      }
      if (EVENT_NAME_REGEX.test(name)) {
        warning(false, 'Unknown event handler property `%s`. It will be ignored.%s', name, getStackAddendum$3());
        warnedProperties$1[name] = true;
        return true;
      }
    } else if (EVENT_NAME_REGEX.test(name)) {
      // If no event plugins have been injected, we are in a server environment.
      // So we can't tell if the event name is correct for sure, but we can filter
      // out known bad ones like `onclick`. We can't suggest a specific replacement though.
      if (INVALID_EVENT_NAME_REGEX.test(name)) {
        warning(false, 'Invalid event handler property `%s`. ' + 'React events use the camelCase naming convention, for example `onClick`.%s', name, getStackAddendum$3());
      }
      warnedProperties$1[name] = true;
      return true;
    }

    // Let the ARIA attribute hook validate ARIA attributes
    if (rARIA$1.test(name) || rARIACamel$1.test(name)) {
      return true;
    }

    if (lowerCasedName === 'innerhtml') {
      warning(false, 'Directly setting property `innerHTML` is not permitted. ' + 'For more information, lookup documentation on `dangerouslySetInnerHTML`.');
      warnedProperties$1[name] = true;
      return true;
    }

    if (lowerCasedName === 'aria') {
      warning(false, 'The `aria` attribute is reserved for future use in React. ' + 'Pass individual `aria-` attributes instead.');
      warnedProperties$1[name] = true;
      return true;
    }

    if (lowerCasedName === 'is' && value !== null && value !== undefined && typeof value !== 'string') {
      warning(false, 'Received a `%s` for a string attribute `is`. If this is expected, cast ' + 'the value to a string.%s', typeof value, getStackAddendum$3());
      warnedProperties$1[name] = true;
      return true;
    }

    if (typeof value === 'number' && isNaN(value)) {
      warning(false, 'Received NaN for the `%s` attribute. If this is expected, cast ' + 'the value to a string.%s', name, getStackAddendum$3());
      warnedProperties$1[name] = true;
      return true;
    }

    var isReserved = isReservedProp(name);

    // Known attributes should match the casing specified in the property config.
    if (possibleStandardNames.hasOwnProperty(lowerCasedName)) {
      var standardName = possibleStandardNames[lowerCasedName];
      if (standardName !== name) {
        warning(false, 'Invalid DOM property `%s`. Did you mean `%s`?%s', name, standardName, getStackAddendum$3());
        warnedProperties$1[name] = true;
        return true;
      }
    } else if (!isReserved && name !== lowerCasedName) {
      // Unknown attributes should have lowercase casing since that's how they
      // will be cased anyway with server rendering.
      warning(false, 'React does not recognize the `%s` prop on a DOM element. If you ' + 'intentionally want it to appear in the DOM as a custom ' + 'attribute, spell it as lowercase `%s` instead. ' + 'If you accidentally passed it from a parent component, remove ' + 'it from the DOM element.%s', name, lowerCasedName, getStackAddendum$3());
      warnedProperties$1[name] = true;
      return true;
    }

    if (typeof value === 'boolean' && !shouldAttributeAcceptBooleanValue(name)) {
      if (value) {
        warning(false, 'Received `%s` for a non-boolean attribute `%s`.\n\n' + 'If you want to write it to the DOM, pass a string instead: ' + '%s="%s" or %s={value.toString()}.%s', value, name, name, value, name, getStackAddendum$3());
      } else {
        warning(false, 'Received `%s` for a non-boolean attribute `%s`.\n\n' + 'If you want to write it to the DOM, pass a string instead: ' + '%s="%s" or %s={value.toString()}.\n\n' + 'If you used to conditionally omit it with %s={condition && value}, ' + 'pass %s={condition ? value : undefined} instead.%s', value, name, name, value, name, name, name, getStackAddendum$3());
      }
      warnedProperties$1[name] = true;
      return true;
    }

    // Now that we've validated casing, do not validate
    // data types for reserved props
    if (isReserved) {
      return true;
    }

    // Warn when a known attribute is a bad type
    if (!shouldSetAttribute(name, value)) {
      warnedProperties$1[name] = true;
      return false;
    }

    return true;
  };
}

var warnUnknownProperties = function (type, props, canUseEventSystem) {
  var unknownProps = [];
  for (var key in props) {
    var isValid = validateProperty$1(type, key, props[key], canUseEventSystem);
    if (!isValid) {
      unknownProps.push(key);
    }
  }

  var unknownPropString = unknownProps.map(function (prop) {
    return '`' + prop + '`';
  }).join(', ');
  if (unknownProps.length === 1) {
    warning(false, 'Invalid value for prop %s on <%s> tag. Either remove it from the element, ' + 'or pass a string or number value to keep it in the DOM. ' + 'For details, see https://fb.me/react-attribute-behavior%s', unknownPropString, type, getStackAddendum$3());
  } else if (unknownProps.length > 1) {
    warning(false, 'Invalid values for props %s on <%s> tag. Either remove them from the element, ' + 'or pass a string or number value to keep them in the DOM. ' + 'For details, see https://fb.me/react-attribute-behavior%s', unknownPropString, type, getStackAddendum$3());
  }
};

function validateProperties$2(type, props, canUseEventSystem) {
  if (isCustomComponent(type, props)) {
    return;
  }
  warnUnknownProperties(type, props, canUseEventSystem);
}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Based on reading the React.Children implementation. TODO: type this somewhere?

var toArray = React.Children.toArray;

var getStackAddendum = emptyFunction.thatReturns('');

{
  var validatePropertiesInDevelopment = function (type, props) {
    validateProperties(type, props);
    validateProperties$1(type, props);
    validateProperties$2(type, props, /* canUseEventSystem */false);
  };

  var describeStackFrame = function (element) {
    var source = element._source;
    var type = element.type;
    var name = getComponentName(type);
    var ownerName = null;
    return describeComponentFrame(name, source, ownerName);
  };

  var currentDebugStack = null;
  var currentDebugElementStack = null;
  var setCurrentDebugStack = function (stack) {
    var frame = stack[stack.length - 1];
    currentDebugElementStack = frame.debugElementStack;
    // We are about to enter a new composite stack, reset the array.
    currentDebugElementStack.length = 0;
    currentDebugStack = stack;
    ReactDebugCurrentFrame.getCurrentStack = getStackAddendum;
  };
  var pushElementToDebugStack = function (element) {
    if (currentDebugElementStack !== null) {
      currentDebugElementStack.push(element);
    }
  };
  var resetCurrentDebugStack = function () {
    currentDebugElementStack = null;
    currentDebugStack = null;
    ReactDebugCurrentFrame.getCurrentStack = null;
  };
  getStackAddendum = function () {
    if (currentDebugStack === null) {
      return '';
    }
    var stack = '';
    var debugStack = currentDebugStack;
    for (var i = debugStack.length - 1; i >= 0; i--) {
      var frame = debugStack[i];
      var _debugElementStack = frame.debugElementStack;
      for (var ii = _debugElementStack.length - 1; ii >= 0; ii--) {
        stack += describeStackFrame(_debugElementStack[ii]);
      }
    }
    return stack;
  };
}

var didWarnDefaultInputValue = false;
var didWarnDefaultChecked = false;
var didWarnDefaultSelectValue = false;
var didWarnDefaultTextareaValue = false;
var didWarnInvalidOptionChildren = false;
var didWarnAboutNoopUpdateForComponent = {};
var valuePropNames = ['value', 'defaultValue'];
var newlineEatingTags = {
  listing: true,
  pre: true,
  textarea: true
};

function getComponentName(type) {
  return typeof type === 'string' ? type : typeof type === 'function' ? type.displayName || type.name : null;
}

// We accept any tag to be rendered but since this gets injected into arbitrary
// HTML, we want to make sure that it's a safe tag.
// http://www.w3.org/TR/REC-xml/#NT-Name
var VALID_TAG_REGEX = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/; // Simplified subset
var validatedTagCache = {};
function validateDangerousTag(tag) {
  if (!validatedTagCache.hasOwnProperty(tag)) {
    !VALID_TAG_REGEX.test(tag) ? invariant(false, 'Invalid tag: %s', tag) : void 0;
    validatedTagCache[tag] = true;
  }
}

var processStyleName = memoizeStringOnly(function (styleName) {
  return hyphenateStyleName(styleName);
});

function createMarkupForStyles(styles) {
  var serialized = '';
  var delimiter = '';
  for (var styleName in styles) {
    if (!styles.hasOwnProperty(styleName)) {
      continue;
    }
    var isCustomProperty = styleName.indexOf('--') === 0;
    var styleValue = styles[styleName];
    {
      if (!isCustomProperty) {
        warnValidStyle$1(styleName, styleValue, getStackAddendum);
      }
    }
    if (styleValue != null) {
      serialized += delimiter + processStyleName(styleName) + ':';
      serialized += dangerousStyleValue(styleName, styleValue, isCustomProperty);

      delimiter = ';';
    }
  }
  return serialized || null;
}

function warnNoop(publicInstance, callerName) {
  {
    var constructor = publicInstance.constructor;
    var componentName = constructor && getComponentName(constructor) || 'ReactClass';
    var warningKey = componentName + '.' + callerName;
    if (didWarnAboutNoopUpdateForComponent[warningKey]) {
      return;
    }

    warning(false, '%s(...): Can only update a mounting component. ' + 'This usually means you called %s() outside componentWillMount() on the server. ' + 'This is a no-op.\n\nPlease check the code for the %s component.', callerName, callerName, componentName);
    didWarnAboutNoopUpdateForComponent[warningKey] = true;
  }
}

function shouldConstruct(Component) {
  return Component.prototype && Component.prototype.isReactComponent;
}

function getNonChildrenInnerMarkup(props) {
  var innerHTML = props.dangerouslySetInnerHTML;
  if (innerHTML != null) {
    if (innerHTML.__html != null) {
      return innerHTML.__html;
    }
  } else {
    var content = props.children;
    if (typeof content === 'string' || typeof content === 'number') {
      return escapeTextForBrowser(content);
    }
  }
  return null;
}

function flattenTopLevelChildren(children) {
  if (!React.isValidElement(children)) {
    return toArray(children);
  }
  var element = children;
  if (element.type !== REACT_FRAGMENT_TYPE) {
    return [element];
  }
  var fragmentChildren = element.props.children;
  if (!React.isValidElement(fragmentChildren)) {
    return toArray(fragmentChildren);
  }
  var fragmentChildElement = fragmentChildren;
  return [fragmentChildElement];
}

function flattenOptionChildren(children) {
  var content = '';
  // Flatten children and warn if they aren't strings or numbers;
  // invalid types are ignored.
  React.Children.forEach(children, function (child) {
    if (child == null) {
      return;
    }
    if (typeof child === 'string' || typeof child === 'number') {
      content += child;
    } else {
      {
        if (!didWarnInvalidOptionChildren) {
          didWarnInvalidOptionChildren = true;
          warning(false, 'Only strings and numbers are supported as <option> children.');
        }
      }
    }
  });
  return content;
}

function maskContext(type, context) {
  var contextTypes = type.contextTypes;
  if (!contextTypes) {
    return emptyObject;
  }
  var maskedContext = {};
  for (var contextName in contextTypes) {
    maskedContext[contextName] = context[contextName];
  }
  return maskedContext;
}

function checkContextTypes(typeSpecs, values, location) {
  {
    checkPropTypes(typeSpecs, values, location, 'Component', getStackAddendum);
  }
}

function processContext(type, context) {
  var maskedContext = maskContext(type, context);
  {
    if (type.contextTypes) {
      checkContextTypes(type.contextTypes, maskedContext, 'context');
    }
  }
  return maskedContext;
}

var STYLE = 'style';
var RESERVED_PROPS$1 = {
  children: null,
  dangerouslySetInnerHTML: null,
  suppressContentEditableWarning: null,
  suppressHydrationWarning: null
};

function createOpenTagMarkup(tagVerbatim, tagLowercase, props, namespace, makeStaticMarkup, isRootElement) {
  var ret = '<' + tagVerbatim;

  for (var propKey in props) {
    if (!props.hasOwnProperty(propKey)) {
      continue;
    }
    var propValue = props[propKey];
    if (propValue == null) {
      continue;
    }
    if (propKey === STYLE) {
      propValue = createMarkupForStyles(propValue);
    }
    var markup = null;
    if (isCustomComponent(tagLowercase, props)) {
      if (!RESERVED_PROPS$1.hasOwnProperty(propKey)) {
        markup = createMarkupForCustomAttribute(propKey, propValue);
      }
    } else {
      markup = createMarkupForProperty(propKey, propValue);
    }
    if (markup) {
      ret += ' ' + markup;
    }
  }

  // For static pages, no need to put React ID and checksum. Saves lots of
  // bytes.
  if (makeStaticMarkup) {
    return ret;
  }

  if (isRootElement) {
    ret += ' ' + createMarkupForRoot();
  }
  return ret;
}

function validateRenderResult(child, type) {
  if (child === undefined) {
    invariant(false, '%s(...): Nothing was returned from render. This usually means a return statement is missing. Or, to render nothing, return null.', getComponentName(type) || 'Component');
  }
}

function resolve(child, context) {
  while (React.isValidElement(child)) {
    // Safe because we just checked it's an element.
    var element = child;
    {
      pushElementToDebugStack(element);
    }
    var Component = element.type;
    if (typeof Component !== 'function') {
      break;
    }
    var publicContext = processContext(Component, context);
    var inst;
    var queue = [];
    var replace = false;
    var updater = {
      isMounted: function (publicInstance) {
        return false;
      },
      enqueueForceUpdate: function (publicInstance) {
        if (queue === null) {
          warnNoop(publicInstance, 'forceUpdate');
          return null;
        }
      },
      enqueueReplaceState: function (publicInstance, completeState) {
        replace = true;
        queue = [completeState];
      },
      enqueueSetState: function (publicInstance, partialState) {
        if (queue === null) {
          warnNoop(publicInstance, 'setState');
          return null;
        }
        queue.push(partialState);
      }
    };

    if (shouldConstruct(Component)) {
      inst = new Component(element.props, publicContext, updater);
    } else {
      inst = Component(element.props, publicContext, updater);
      if (inst == null || inst.render == null) {
        child = inst;
        validateRenderResult(child, Component);
        continue;
      }
    }

    inst.props = element.props;
    inst.context = publicContext;
    inst.updater = updater;

    var initialState = inst.state;
    if (initialState === undefined) {
      inst.state = initialState = null;
    }
    if (inst.componentWillMount) {
      inst.componentWillMount();
      if (queue.length) {
        var oldQueue = queue;
        var oldReplace = replace;
        queue = null;
        replace = false;

        if (oldReplace && oldQueue.length === 1) {
          inst.state = oldQueue[0];
        } else {
          var nextState = oldReplace ? oldQueue[0] : inst.state;
          var dontMutate = true;
          for (var i = oldReplace ? 1 : 0; i < oldQueue.length; i++) {
            var partial = oldQueue[i];
            var partialState = typeof partial === 'function' ? partial.call(inst, nextState, element.props, publicContext) : partial;
            if (partialState) {
              if (dontMutate) {
                dontMutate = false;
                nextState = _assign({}, nextState, partialState);
              } else {
                _assign(nextState, partialState);
              }
            }
          }
          inst.state = nextState;
        }
      } else {
        queue = null;
      }
    }
    child = inst.render();

    {
      if (child === undefined && inst.render._isMockFunction) {
        // This is probably bad practice. Consider warning here and
        // deprecating this convenience.
        child = null;
      }
    }
    validateRenderResult(child, Component);

    var childContext;
    if (typeof inst.getChildContext === 'function') {
      var childContextTypes = Component.childContextTypes;
      if (typeof childContextTypes === 'object') {
        childContext = inst.getChildContext();
        for (var contextKey in childContext) {
          !(contextKey in childContextTypes) ? invariant(false, '%s.getChildContext(): key "%s" is not defined in childContextTypes.', getComponentName(Component) || 'Unknown', contextKey) : void 0;
        }
      } else {
        warning(false, '%s.getChildContext(): childContextTypes must be defined in order to ' + 'use getChildContext().', getComponentName(Component) || 'Unknown');
      }
    }
    if (childContext) {
      context = _assign({}, context, childContext);
    }
  }
  return { child: child, context: context };
}

var ReactDOMServerRenderer = function () {
  function ReactDOMServerRenderer(children, makeStaticMarkup) {
    _classCallCheck(this, ReactDOMServerRenderer);

    var flatChildren = flattenTopLevelChildren(children);

    var topFrame = {
      // Assume all trees start in the HTML namespace (not totally true, but
      // this is what we did historically)
      domNamespace: Namespaces.html,
      children: flatChildren,
      childIndex: 0,
      context: emptyObject,
      footer: ''
    };
    {
      topFrame.debugElementStack = [];
    }
    this.stack = [topFrame];
    this.exhausted = false;
    this.currentSelectValue = null;
    this.previousWasTextNode = false;
    this.makeStaticMarkup = makeStaticMarkup;
  }
  // TODO: type this more strictly:


  ReactDOMServerRenderer.prototype.read = function read(bytes) {
    if (this.exhausted) {
      return null;
    }

    var out = '';
    while (out.length < bytes) {
      if (this.stack.length === 0) {
        this.exhausted = true;
        break;
      }
      var frame = this.stack[this.stack.length - 1];
      if (frame.childIndex >= frame.children.length) {
        var footer = frame.footer;
        out += footer;
        if (footer !== '') {
          this.previousWasTextNode = false;
        }
        this.stack.pop();
        if (frame.tag === 'select') {
          this.currentSelectValue = null;
        }
        continue;
      }
      var child = frame.children[frame.childIndex++];
      {
        setCurrentDebugStack(this.stack);
      }
      out += this.render(child, frame.context, frame.domNamespace);
      {
        // TODO: Handle reentrant server render calls. This doesn't.
        resetCurrentDebugStack();
      }
    }
    return out;
  };

  ReactDOMServerRenderer.prototype.render = function render(child, context, parentNamespace) {
    if (typeof child === 'string' || typeof child === 'number') {
      var text = '' + child;
      if (text === '') {
        return '';
      }
      if (this.makeStaticMarkup) {
        return escapeTextForBrowser(text);
      }
      if (this.previousWasTextNode) {
        return '<!-- -->' + escapeTextForBrowser(text);
      }
      this.previousWasTextNode = true;
      return escapeTextForBrowser(text);
    } else {
      var nextChild;

      var _resolve = resolve(child, context);

      nextChild = _resolve.child;
      context = _resolve.context;

      if (nextChild === null || nextChild === false) {
        return '';
      } else if (!React.isValidElement(nextChild)) {
        var nextChildren = toArray(nextChild);
        var frame = {
          domNamespace: parentNamespace,
          children: nextChildren,
          childIndex: 0,
          context: context,
          footer: ''
        };
        {
          frame.debugElementStack = [];
        }
        this.stack.push(frame);
        return '';
      } else if (nextChild.type === REACT_FRAGMENT_TYPE) {
        var _nextChildren = toArray(nextChild.props.children);
        var _frame = {
          domNamespace: parentNamespace,
          children: _nextChildren,
          childIndex: 0,
          context: context,
          footer: ''
        };
        {
          _frame.debugElementStack = [];
        }
        this.stack.push(_frame);
        return '';
      } else {
        // Safe because we just checked it's an element.
        var nextElement = nextChild;
        return this.renderDOM(nextElement, context, parentNamespace);
      }
    }
  };

  ReactDOMServerRenderer.prototype.renderDOM = function renderDOM(element, context, parentNamespace) {
    var tag = element.type.toLowerCase();

    var namespace = parentNamespace;
    if (parentNamespace === Namespaces.html) {
      namespace = getIntrinsicNamespace(tag);
    }

    {
      if (namespace === Namespaces.html) {
        // Should this check be gated by parent namespace? Not sure we want to
        // allow <SVG> or <mATH>.
        warning(tag === element.type, '<%s /> is using uppercase HTML. Always use lowercase HTML tags ' + 'in React.', element.type);
      }
    }

    validateDangerousTag(tag);

    var props = element.props;
    if (tag === 'input') {
      {
        ReactControlledValuePropTypes.checkPropTypes('input', props, getStackAddendum);

        if (props.checked !== undefined && props.defaultChecked !== undefined && !didWarnDefaultChecked) {
          warning(false, '%s contains an input of type %s with both checked and defaultChecked props. ' + 'Input elements must be either controlled or uncontrolled ' + '(specify either the checked prop, or the defaultChecked prop, but not ' + 'both). Decide between using a controlled or uncontrolled input ' + 'element and remove one of these props. More info: ' + 'https://fb.me/react-controlled-components', 'A component', props.type);
          didWarnDefaultChecked = true;
        }
        if (props.value !== undefined && props.defaultValue !== undefined && !didWarnDefaultInputValue) {
          warning(false, '%s contains an input of type %s with both value and defaultValue props. ' + 'Input elements must be either controlled or uncontrolled ' + '(specify either the value prop, or the defaultValue prop, but not ' + 'both). Decide between using a controlled or uncontrolled input ' + 'element and remove one of these props. More info: ' + 'https://fb.me/react-controlled-components', 'A component', props.type);
          didWarnDefaultInputValue = true;
        }
      }

      props = _assign({
        type: undefined
      }, props, {
        defaultChecked: undefined,
        defaultValue: undefined,
        value: props.value != null ? props.value : props.defaultValue,
        checked: props.checked != null ? props.checked : props.defaultChecked
      });
    } else if (tag === 'textarea') {
      {
        ReactControlledValuePropTypes.checkPropTypes('textarea', props, getStackAddendum);
        if (props.value !== undefined && props.defaultValue !== undefined && !didWarnDefaultTextareaValue) {
          warning(false, 'Textarea elements must be either controlled or uncontrolled ' + '(specify either the value prop, or the defaultValue prop, but not ' + 'both). Decide between using a controlled or uncontrolled textarea ' + 'and remove one of these props. More info: ' + 'https://fb.me/react-controlled-components');
          didWarnDefaultTextareaValue = true;
        }
      }

      var initialValue = props.value;
      if (initialValue == null) {
        var defaultValue = props.defaultValue;
        // TODO (yungsters): Remove support for children content in <textarea>.
        var textareaChildren = props.children;
        if (textareaChildren != null) {
          {
            warning(false, 'Use the `defaultValue` or `value` props instead of setting ' + 'children on <textarea>.');
          }
          !(defaultValue == null) ? invariant(false, 'If you supply `defaultValue` on a <textarea>, do not pass children.') : void 0;
          if (Array.isArray(textareaChildren)) {
            !(textareaChildren.length <= 1) ? invariant(false, '<textarea> can only have at most one child.') : void 0;
            textareaChildren = textareaChildren[0];
          }

          defaultValue = '' + textareaChildren;
        }
        if (defaultValue == null) {
          defaultValue = '';
        }
        initialValue = defaultValue;
      }

      props = _assign({}, props, {
        value: undefined,
        children: '' + initialValue
      });
    } else if (tag === 'select') {
      {
        ReactControlledValuePropTypes.checkPropTypes('select', props, getStackAddendum);

        for (var i = 0; i < valuePropNames.length; i++) {
          var propName = valuePropNames[i];
          if (props[propName] == null) {
            continue;
          }
          var isArray = Array.isArray(props[propName]);
          if (props.multiple && !isArray) {
            warning(false, 'The `%s` prop supplied to <select> must be an array if ' + '`multiple` is true.%s', propName, '');
          } else if (!props.multiple && isArray) {
            warning(false, 'The `%s` prop supplied to <select> must be a scalar ' + 'value if `multiple` is false.%s', propName, '');
          }
        }

        if (props.value !== undefined && props.defaultValue !== undefined && !didWarnDefaultSelectValue) {
          warning(false, 'Select elements must be either controlled or uncontrolled ' + '(specify either the value prop, or the defaultValue prop, but not ' + 'both). Decide between using a controlled or uncontrolled select ' + 'element and remove one of these props. More info: ' + 'https://fb.me/react-controlled-components');
          didWarnDefaultSelectValue = true;
        }
      }
      this.currentSelectValue = props.value != null ? props.value : props.defaultValue;
      props = _assign({}, props, {
        value: undefined
      });
    } else if (tag === 'option') {
      var selected = null;
      var selectValue = this.currentSelectValue;
      var optionChildren = flattenOptionChildren(props.children);
      if (selectValue != null) {
        var value;
        if (props.value != null) {
          value = props.value + '';
        } else {
          value = optionChildren;
        }
        selected = false;
        if (Array.isArray(selectValue)) {
          // multiple
          for (var j = 0; j < selectValue.length; j++) {
            if ('' + selectValue[j] === value) {
              selected = true;
              break;
            }
          }
        } else {
          selected = '' + selectValue === value;
        }

        props = _assign({
          selected: undefined,
          children: undefined
        }, props, {
          selected: selected,
          children: optionChildren
        });
      }
    }

    {
      validatePropertiesInDevelopment(tag, props);
    }

    assertValidProps(tag, props, getStackAddendum);

    var out = createOpenTagMarkup(element.type, tag, props, namespace, this.makeStaticMarkup, this.stack.length === 1);
    var footer = '';
    if (omittedCloseTags.hasOwnProperty(tag)) {
      out += '/>';
    } else {
      out += '>';
      footer = '</' + element.type + '>';
    }
    var children;
    var innerMarkup = getNonChildrenInnerMarkup(props);
    if (innerMarkup != null) {
      children = [];
      if (newlineEatingTags[tag] && innerMarkup.charAt(0) === '\n') {
        // text/html ignores the first character in these tags if it's a newline
        // Prefer to break application/xml over text/html (for now) by adding
        // a newline specifically to get eaten by the parser. (Alternately for
        // textareas, replacing "^\n" with "\r\n" doesn't get eaten, and the first
        // \r is normalized out by HTMLTextAreaElement#value.)
        // See: <http://www.w3.org/TR/html-polyglot/#newlines-in-textarea-and-pre>
        // See: <http://www.w3.org/TR/html5/syntax.html#element-restrictions>
        // See: <http://www.w3.org/TR/html5/syntax.html#newlines>
        // See: Parsing of "textarea" "listing" and "pre" elements
        //  from <http://www.w3.org/TR/html5/syntax.html#parsing-main-inbody>
        out += '\n';
      }
      out += innerMarkup;
    } else {
      children = toArray(props.children);
    }
    var frame = {
      domNamespace: getChildNamespace(parentNamespace, element.type),
      tag: tag,
      children: children,
      childIndex: 0,
      context: context,
      footer: footer
    };
    {
      frame.debugElementStack = [];
    }
    this.stack.push(frame);
    this.previousWasTextNode = false;
    return out;
  };

  return ReactDOMServerRenderer;
}();

/**
 * Render a ReactElement to its initial HTML. This should only be used on the
 * server.
 * See https://reactjs.org/docs/react-dom-server.html#rendertostring
 */
function renderToString(element) {
  var renderer = new ReactDOMServerRenderer(element, false);
  var markup = renderer.read(Infinity);
  return markup;
}

/**
 * Similar to renderToString, except this doesn't create extra DOM attributes
 * such as data-react-id that React uses internally.
 * See https://reactjs.org/docs/react-dom-server.html#rendertostaticmarkup
 */
function renderToStaticMarkup(element) {
  var renderer = new ReactDOMServerRenderer(element, true);
  var markup = renderer.read(Infinity);
  return markup;
}

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// This is a Readable Node.js stream which wraps the ReactDOMPartialRenderer.

var ReactMarkupReadableStream = function (_Readable) {
  _inherits(ReactMarkupReadableStream, _Readable);

  function ReactMarkupReadableStream(element, makeStaticMarkup) {
    _classCallCheck$1(this, ReactMarkupReadableStream);

    var _this = _possibleConstructorReturn(this, _Readable.call(this, {}));
    // Calls the stream.Readable(options) constructor. Consider exposing built-in
    // features like highWaterMark in the future.


    _this.partialRenderer = new ReactDOMServerRenderer(element, makeStaticMarkup);
    return _this;
  }

  ReactMarkupReadableStream.prototype._read = function _read(size) {
    try {
      this.push(this.partialRenderer.read(size));
    } catch (err) {
      this.emit('error', err);
    }
  };

  return ReactMarkupReadableStream;
}(stream.Readable);
/**
 * Render a ReactElement to its initial HTML. This should only be used on the
 * server.
 * See https://reactjs.org/docs/react-dom-stream.html#rendertonodestream
 */


function renderToNodeStream(element) {
  return new ReactMarkupReadableStream(element, false);
}

/**
 * Similar to renderToNodeStream, except this doesn't create extra DOM attributes
 * such as data-react-id that React uses internally.
 * See https://reactjs.org/docs/react-dom-stream.html#rendertostaticnodestream
 */
function renderToStaticNodeStream(element) {
  return new ReactMarkupReadableStream(element, true);
}

// Note: when changing this, also consider https://github.com/facebook/react/issues/11526
var ReactDOMServerNode = {
  renderToString: renderToString,
  renderToStaticMarkup: renderToStaticMarkup,
  renderToNodeStream: renderToNodeStream,
  renderToStaticNodeStream: renderToStaticNodeStream,
  version: ReactVersion
};

var ReactDOMServerNode$1 = Object.freeze({
	default: ReactDOMServerNode
});

var ReactDOMServer = ( ReactDOMServerNode$1 && ReactDOMServerNode ) || ReactDOMServerNode$1;

// TODO: decide on the top-level export form.
// This is hacky but makes it work with both Rollup and Jest
var server_node = ReactDOMServer['default'] ? ReactDOMServer['default'] : ReactDOMServer;

module.exports = server_node;
  })();
}


/***/ }),

/***/ "./node_modules/react-dom/server.js":
/*!******************************************!*\
  !*** ./node_modules/react-dom/server.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(/*! ./server.node */ "./node_modules/react-dom/server.node.js");


/***/ }),

/***/ "./node_modules/react-dom/server.node.js":
/*!***********************************************!*\
  !*** ./node_modules/react-dom/server.node.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (false) {} else {
  module.exports = __webpack_require__(/*! ./cjs/react-dom-server.node.development.js */ "./node_modules/react-dom/cjs/react-dom-server.node.development.js");
}


/***/ }),

/***/ "./public/scss/client.scss":
/*!*********************************!*\
  !*** ./public/scss/client.scss ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports
exports.push([module.i, "@import url(https://fonts.googleapis.com/css?family=Source+Sans+Pro:100,300,400,500,600,700);", ""]);
exports.push([module.i, "@import url(https://fonts.googleapis.com/css?family=Open+Sans:400,400italic,700);", ""]);
exports.push([module.i, "@import url(http://cdn.jsdelivr.net/highlight.js/9.8.0/styles/monokai.min.css);", ""]);

// module
exports.push([module.i, "/*! -----------------------------------------------------------------\n[Master Stylesheet for Client]\n\nProject:     Ajaxtown\nVersion:     1.0\nLast change: 21/03/2017\nPrimary use: Blog\n\n------------------------------------------------------------------\n[Sidebar Styles]\n*/\n/*!\n * Bootstrap v3.3.7 (http://getbootstrap.com)\n * Copyright 2011-2018 Twitter, Inc.\n * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)\n */\n/*!\n * Generated using the Bootstrap Customizer (https://getbootstrap.com/docs/3.3/customize/?id=fb9cf0492cdd319e06bf584558a6c0e9)\n * Config saved to config.json and https://gist.github.com/fb9cf0492cdd319e06bf584558a6c0e9\n */\n/*!\n * Bootstrap v3.3.7 (http://getbootstrap.com)\n * Copyright 2011-2016 Twitter, Inc.\n * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)\n */\n/*! normalize.css v3.0.3 | MIT License | github.com/necolas/normalize.css */\nhtml{font-family:sans-serif;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}\nbody{margin:0}\narticle,aside,details,figcaption,figure,footer,header,hgroup,main,menu,nav,section,summary{display:block}\naudio,canvas,progress,video{display:inline-block;vertical-align:baseline}\naudio:not([controls]){display:none;height:0}\n[hidden],template{display:none}\na{background-color:transparent}\na:active,a:hover{outline:0}\nabbr[title]{border-bottom:1px dotted}\nb,strong{font-weight:bold}\ndfn{font-style:italic}\nh1{font-size:2em;margin:0.67em 0}\nmark{background:#ff0;color:#000}\nsmall{font-size:80%}\nsub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}\nsup{top:-0.5em}\nsub{bottom:-0.25em}\nimg{border:0}\nsvg:not(:root){overflow:hidden}\nfigure{margin:1em 40px}\nhr{-webkit-box-sizing:content-box;box-sizing:content-box;height:0}\npre{overflow:auto}\ncode,kbd,pre,samp{font-family:monospace, monospace;font-size:1em}\nbutton,input,optgroup,select,textarea{color:inherit;font:inherit;margin:0}\nbutton{overflow:visible}\nbutton,select{text-transform:none}\nbutton,html input[type=\"button\"],input[type=\"reset\"],input[type=\"submit\"]{-webkit-appearance:button;cursor:pointer}\nbutton[disabled],html input[disabled]{cursor:default}\nbutton::-moz-focus-inner,input::-moz-focus-inner{border:0;padding:0}\ninput{line-height:normal}\ninput[type=\"checkbox\"],input[type=\"radio\"]{-webkit-box-sizing:border-box;box-sizing:border-box;padding:0}\ninput[type=\"number\"]::-webkit-inner-spin-button,input[type=\"number\"]::-webkit-outer-spin-button{height:auto}\ninput[type=\"search\"]{-webkit-appearance:textfield;-webkit-box-sizing:content-box;box-sizing:content-box}\ninput[type=\"search\"]::-webkit-search-cancel-button,input[type=\"search\"]::-webkit-search-decoration{-webkit-appearance:none}\nfieldset{border:1px solid #c0c0c0;margin:0 2px;padding:0.35em 0.625em 0.75em}\nlegend{border:0;padding:0}\ntextarea{overflow:auto}\noptgroup{font-weight:bold}\ntable{border-collapse:collapse;border-spacing:0}\ntd,th{padding:0}\n/*! Source: https://github.com/h5bp/html5-boilerplate/blob/master/src/css/main.css */\n@media print{*,*:before,*:after{background:transparent !important;color:#000 !important;-webkit-box-shadow:none !important;box-shadow:none !important;text-shadow:none !important}a,a:visited{text-decoration:underline}a[href]:after{content:\" (\" attr(href) \")\"}abbr[title]:after{content:\" (\" attr(title) \")\"}a[href^=\"#\"]:after,a[href^=\"javascript:\"]:after{content:\"\"}pre,blockquote{border:1px solid #999;page-break-inside:avoid}thead{display:table-header-group}tr,img{page-break-inside:avoid}img{max-width:100% !important}p,h2,h3{orphans:3;widows:3}h2,h3{page-break-after:avoid}.navbar{display:none}.btn>.caret,.dropup>.btn>.caret{border-top-color:#000 !important}.label{border:1px solid #000}.table{border-collapse:collapse !important}.table td,.table th{background-color:#fff !important}.table-bordered th,.table-bordered td{border:1px solid #ddd !important}}\n*{-webkit-box-sizing:border-box;box-sizing:border-box}\n*:before,*:after{-webkit-box-sizing:border-box;box-sizing:border-box}\nhtml{font-size:10px;-webkit-tap-highlight-color:rgba(0, 0, 0, 0)}\nbody{font-family:\"Helvetica Neue\",Helvetica,Arial,sans-serif;font-size:14px;line-height:1.42857143;color:#333;background-color:#fff}\ninput,button,select,textarea{font-family:inherit;font-size:inherit;line-height:inherit}\na{color:#337ab7;text-decoration:none}\na:hover,a:focus{color:#23527c;text-decoration:underline}\na:focus{outline:5px auto -webkit-focus-ring-color;outline-offset:-2px}\nfigure{margin:0}\nimg{vertical-align:middle}\n.img-responsive,.thumbnail>img,.thumbnail a>img{display:block;max-width:100%;height:auto}\n.img-rounded{border-radius:6px}\n.img-thumbnail{padding:4px;line-height:1.42857143;background-color:#fff;border:1px solid #ddd;border-radius:4px;-webkit-transition:all .2s ease-in-out;transition:all .2s ease-in-out;display:inline-block;max-width:100%;height:auto}\n.img-circle{border-radius:50%}\nhr{margin-top:20px;margin-bottom:20px;border:0;border-top:1px solid #eee}\n.sr-only{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0, 0, 0, 0);border:0}\n.sr-only-focusable:active,.sr-only-focusable:focus{position:static;width:auto;height:auto;margin:0;overflow:visible;clip:auto}\n[role=\"button\"]{cursor:pointer}\nh1,h2,h3,h4,h5,h6,.h1,.h2,.h3,.h4,.h5,.h6{font-family:inherit;font-weight:500;line-height:1.1;color:inherit}\nh1 small,h2 small,h3 small,h4 small,h5 small,h6 small,.h1 small,.h2 small,.h3 small,.h4 small,.h5 small,.h6 small,h1 .small,h2 .small,h3 .small,h4 .small,h5 .small,h6 .small,.h1 .small,.h2 .small,.h3 .small,.h4 .small,.h5 .small,.h6 .small{font-weight:normal;line-height:1;color:#777}\nh1,.h1,h2,.h2,h3,.h3{margin-top:20px;margin-bottom:10px}\nh1 small,.h1 small,h2 small,.h2 small,h3 small,.h3 small,h1 .small,.h1 .small,h2 .small,.h2 .small,h3 .small,.h3 .small{font-size:65%}\nh4,.h4,h5,.h5,h6,.h6{margin-top:10px;margin-bottom:10px}\nh4 small,.h4 small,h5 small,.h5 small,h6 small,.h6 small,h4 .small,.h4 .small,h5 .small,.h5 .small,h6 .small,.h6 .small{font-size:75%}\nh1,.h1{font-size:36px}\nh2,.h2{font-size:30px}\nh3,.h3{font-size:24px}\nh4,.h4{font-size:18px}\nh5,.h5{font-size:14px}\nh6,.h6{font-size:12px}\np{margin:0 0 10px}\n.lead{margin-bottom:20px;font-size:16px;font-weight:300;line-height:1.4}\n@media (min-width:768px){.lead{font-size:21px}}\nsmall,.small{font-size:85%}\nmark,.mark{background-color:#fcf8e3;padding:.2em}\n.text-left{text-align:left}\n.text-right{text-align:right}\n.text-center{text-align:center}\n.text-justify{text-align:justify}\n.text-nowrap{white-space:nowrap}\n.text-lowercase{text-transform:lowercase}\n.text-uppercase{text-transform:uppercase}\n.text-capitalize{text-transform:capitalize}\n.text-muted{color:#777}\n.text-primary{color:#337ab7}\na.text-primary:hover,a.text-primary:focus{color:#286090}\n.text-success{color:#3c763d}\na.text-success:hover,a.text-success:focus{color:#2b542c}\n.text-info{color:#31708f}\na.text-info:hover,a.text-info:focus{color:#245269}\n.text-warning{color:#8a6d3b}\na.text-warning:hover,a.text-warning:focus{color:#66512c}\n.text-danger{color:#a94442}\na.text-danger:hover,a.text-danger:focus{color:#843534}\n.bg-primary{color:#fff;background-color:#337ab7}\na.bg-primary:hover,a.bg-primary:focus{background-color:#286090}\n.bg-success{background-color:#dff0d8}\na.bg-success:hover,a.bg-success:focus{background-color:#c1e2b3}\n.bg-info{background-color:#d9edf7}\na.bg-info:hover,a.bg-info:focus{background-color:#afd9ee}\n.bg-warning{background-color:#fcf8e3}\na.bg-warning:hover,a.bg-warning:focus{background-color:#f7ecb5}\n.bg-danger{background-color:#f2dede}\na.bg-danger:hover,a.bg-danger:focus{background-color:#e4b9b9}\n.page-header{padding-bottom:9px;margin:40px 0 20px;border-bottom:1px solid #eee}\nul,ol{margin-top:0;margin-bottom:10px}\nul ul,ol ul,ul ol,ol ol{margin-bottom:0}\n.list-unstyled{padding-left:0;list-style:none}\n.list-inline{padding-left:0;list-style:none;margin-left:-5px}\n.list-inline>li{display:inline-block;padding-left:5px;padding-right:5px}\ndl{margin-top:0;margin-bottom:20px}\ndt,dd{line-height:1.42857143}\ndt{font-weight:bold}\ndd{margin-left:0}\n@media (min-width:768px){.dl-horizontal dt{float:left;width:160px;clear:left;text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dl-horizontal dd{margin-left:180px}}\nabbr[title],abbr[data-original-title]{cursor:help;border-bottom:1px dotted #777}\n.initialism{font-size:90%;text-transform:uppercase}\nblockquote{padding:10px 20px;margin:0 0 20px;font-size:17.5px;border-left:5px solid #eee}\nblockquote p:last-child,blockquote ul:last-child,blockquote ol:last-child{margin-bottom:0}\nblockquote footer,blockquote small,blockquote .small{display:block;font-size:80%;line-height:1.42857143;color:#777}\nblockquote footer:before,blockquote small:before,blockquote .small:before{content:'\\2014   \\A0'}\n.blockquote-reverse,blockquote.pull-right{padding-right:15px;padding-left:0;border-right:5px solid #eee;border-left:0;text-align:right}\n.blockquote-reverse footer:before,blockquote.pull-right footer:before,.blockquote-reverse small:before,blockquote.pull-right small:before,.blockquote-reverse .small:before,blockquote.pull-right .small:before{content:''}\n.blockquote-reverse footer:after,blockquote.pull-right footer:after,.blockquote-reverse small:after,blockquote.pull-right small:after,.blockquote-reverse .small:after,blockquote.pull-right .small:after{content:'\\A0   \\2014'}\naddress{margin-bottom:20px;font-style:normal;line-height:1.42857143}\ncode,kbd,pre,samp{font-family:Menlo,Monaco,Consolas,\"Courier New\",monospace}\ncode{padding:2px 4px;font-size:90%;color:#c7254e;background-color:#f9f2f4;border-radius:4px}\nkbd{padding:2px 4px;font-size:90%;color:#fff;background-color:#333;border-radius:3px;-webkit-box-shadow:inset 0 -1px 0 rgba(0, 0, 0, .25);box-shadow:inset 0 -1px 0 rgba(0, 0, 0, .25)}\nkbd kbd{padding:0;font-size:100%;font-weight:bold;-webkit-box-shadow:none;box-shadow:none}\npre{display:block;padding:9.5px;margin:0 0 10px;font-size:13px;line-height:1.42857143;word-break:break-all;word-wrap:break-word;color:#333;background-color:#f5f5f5;border:1px solid #ccc;border-radius:4px}\npre code{padding:0;font-size:inherit;color:inherit;white-space:pre-wrap;background-color:transparent;border-radius:0}\n.pre-scrollable{max-height:340px;overflow-y:scroll}\n.container{margin-right:auto;margin-left:auto;padding-left:15px;padding-right:15px}\n@media (min-width:768px){.container{width:750px}}\n@media (min-width:992px){.container{width:970px}}\n@media (min-width:1200px){.container{width:1170px}}\n.container-fluid{margin-right:auto;margin-left:auto;padding-left:15px;padding-right:15px}\n.row{margin-left:-15px;margin-right:-15px}\n.col-xs-1, .col-sm-1, .col-md-1, .col-lg-1, .col-xs-2, .col-sm-2, .col-md-2, .col-lg-2, .col-xs-3, .col-sm-3, .col-md-3, .col-lg-3, .col-xs-4, .col-sm-4, .col-md-4, .col-lg-4, .col-xs-5, .col-sm-5, .col-md-5, .col-lg-5, .col-xs-6, .col-sm-6, .col-md-6, .col-lg-6, .col-xs-7, .col-sm-7, .col-md-7, .col-lg-7, .col-xs-8, .col-sm-8, .col-md-8, .col-lg-8, .col-xs-9, .col-sm-9, .col-md-9, .col-lg-9, .col-xs-10, .col-sm-10, .col-md-10, .col-lg-10, .col-xs-11, .col-sm-11, .col-md-11, .col-lg-11, .col-xs-12, .col-sm-12, .col-md-12, .col-lg-12{position:relative;min-height:1px;padding-left:15px;padding-right:15px}\n.col-xs-1, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9, .col-xs-10, .col-xs-11, .col-xs-12{float:left}\n.col-xs-12{width:100%}\n.col-xs-11{width:91.66666667%}\n.col-xs-10{width:83.33333333%}\n.col-xs-9{width:75%}\n.col-xs-8{width:66.66666667%}\n.col-xs-7{width:58.33333333%}\n.col-xs-6{width:50%}\n.col-xs-5{width:41.66666667%}\n.col-xs-4{width:33.33333333%}\n.col-xs-3{width:25%}\n.col-xs-2{width:16.66666667%}\n.col-xs-1{width:8.33333333%}\n.col-xs-pull-12{right:100%}\n.col-xs-pull-11{right:91.66666667%}\n.col-xs-pull-10{right:83.33333333%}\n.col-xs-pull-9{right:75%}\n.col-xs-pull-8{right:66.66666667%}\n.col-xs-pull-7{right:58.33333333%}\n.col-xs-pull-6{right:50%}\n.col-xs-pull-5{right:41.66666667%}\n.col-xs-pull-4{right:33.33333333%}\n.col-xs-pull-3{right:25%}\n.col-xs-pull-2{right:16.66666667%}\n.col-xs-pull-1{right:8.33333333%}\n.col-xs-pull-0{right:auto}\n.col-xs-push-12{left:100%}\n.col-xs-push-11{left:91.66666667%}\n.col-xs-push-10{left:83.33333333%}\n.col-xs-push-9{left:75%}\n.col-xs-push-8{left:66.66666667%}\n.col-xs-push-7{left:58.33333333%}\n.col-xs-push-6{left:50%}\n.col-xs-push-5{left:41.66666667%}\n.col-xs-push-4{left:33.33333333%}\n.col-xs-push-3{left:25%}\n.col-xs-push-2{left:16.66666667%}\n.col-xs-push-1{left:8.33333333%}\n.col-xs-push-0{left:auto}\n.col-xs-offset-12{margin-left:100%}\n.col-xs-offset-11{margin-left:91.66666667%}\n.col-xs-offset-10{margin-left:83.33333333%}\n.col-xs-offset-9{margin-left:75%}\n.col-xs-offset-8{margin-left:66.66666667%}\n.col-xs-offset-7{margin-left:58.33333333%}\n.col-xs-offset-6{margin-left:50%}\n.col-xs-offset-5{margin-left:41.66666667%}\n.col-xs-offset-4{margin-left:33.33333333%}\n.col-xs-offset-3{margin-left:25%}\n.col-xs-offset-2{margin-left:16.66666667%}\n.col-xs-offset-1{margin-left:8.33333333%}\n.col-xs-offset-0{margin-left:0}\n@media (min-width:768px){.col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12{float:left}.col-sm-12{width:100%}.col-sm-11{width:91.66666667%}.col-sm-10{width:83.33333333%}.col-sm-9{width:75%}.col-sm-8{width:66.66666667%}.col-sm-7{width:58.33333333%}.col-sm-6{width:50%}.col-sm-5{width:41.66666667%}.col-sm-4{width:33.33333333%}.col-sm-3{width:25%}.col-sm-2{width:16.66666667%}.col-sm-1{width:8.33333333%}.col-sm-pull-12{right:100%}.col-sm-pull-11{right:91.66666667%}.col-sm-pull-10{right:83.33333333%}.col-sm-pull-9{right:75%}.col-sm-pull-8{right:66.66666667%}.col-sm-pull-7{right:58.33333333%}.col-sm-pull-6{right:50%}.col-sm-pull-5{right:41.66666667%}.col-sm-pull-4{right:33.33333333%}.col-sm-pull-3{right:25%}.col-sm-pull-2{right:16.66666667%}.col-sm-pull-1{right:8.33333333%}.col-sm-pull-0{right:auto}.col-sm-push-12{left:100%}.col-sm-push-11{left:91.66666667%}.col-sm-push-10{left:83.33333333%}.col-sm-push-9{left:75%}.col-sm-push-8{left:66.66666667%}.col-sm-push-7{left:58.33333333%}.col-sm-push-6{left:50%}.col-sm-push-5{left:41.66666667%}.col-sm-push-4{left:33.33333333%}.col-sm-push-3{left:25%}.col-sm-push-2{left:16.66666667%}.col-sm-push-1{left:8.33333333%}.col-sm-push-0{left:auto}.col-sm-offset-12{margin-left:100%}.col-sm-offset-11{margin-left:91.66666667%}.col-sm-offset-10{margin-left:83.33333333%}.col-sm-offset-9{margin-left:75%}.col-sm-offset-8{margin-left:66.66666667%}.col-sm-offset-7{margin-left:58.33333333%}.col-sm-offset-6{margin-left:50%}.col-sm-offset-5{margin-left:41.66666667%}.col-sm-offset-4{margin-left:33.33333333%}.col-sm-offset-3{margin-left:25%}.col-sm-offset-2{margin-left:16.66666667%}.col-sm-offset-1{margin-left:8.33333333%}.col-sm-offset-0{margin-left:0}}\n@media (min-width:992px){.col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12{float:left}.col-md-12{width:100%}.col-md-11{width:91.66666667%}.col-md-10{width:83.33333333%}.col-md-9{width:75%}.col-md-8{width:66.66666667%}.col-md-7{width:58.33333333%}.col-md-6{width:50%}.col-md-5{width:41.66666667%}.col-md-4{width:33.33333333%}.col-md-3{width:25%}.col-md-2{width:16.66666667%}.col-md-1{width:8.33333333%}.col-md-pull-12{right:100%}.col-md-pull-11{right:91.66666667%}.col-md-pull-10{right:83.33333333%}.col-md-pull-9{right:75%}.col-md-pull-8{right:66.66666667%}.col-md-pull-7{right:58.33333333%}.col-md-pull-6{right:50%}.col-md-pull-5{right:41.66666667%}.col-md-pull-4{right:33.33333333%}.col-md-pull-3{right:25%}.col-md-pull-2{right:16.66666667%}.col-md-pull-1{right:8.33333333%}.col-md-pull-0{right:auto}.col-md-push-12{left:100%}.col-md-push-11{left:91.66666667%}.col-md-push-10{left:83.33333333%}.col-md-push-9{left:75%}.col-md-push-8{left:66.66666667%}.col-md-push-7{left:58.33333333%}.col-md-push-6{left:50%}.col-md-push-5{left:41.66666667%}.col-md-push-4{left:33.33333333%}.col-md-push-3{left:25%}.col-md-push-2{left:16.66666667%}.col-md-push-1{left:8.33333333%}.col-md-push-0{left:auto}.col-md-offset-12{margin-left:100%}.col-md-offset-11{margin-left:91.66666667%}.col-md-offset-10{margin-left:83.33333333%}.col-md-offset-9{margin-left:75%}.col-md-offset-8{margin-left:66.66666667%}.col-md-offset-7{margin-left:58.33333333%}.col-md-offset-6{margin-left:50%}.col-md-offset-5{margin-left:41.66666667%}.col-md-offset-4{margin-left:33.33333333%}.col-md-offset-3{margin-left:25%}.col-md-offset-2{margin-left:16.66666667%}.col-md-offset-1{margin-left:8.33333333%}.col-md-offset-0{margin-left:0}}\n@media (min-width:1200px){.col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12{float:left}.col-lg-12{width:100%}.col-lg-11{width:91.66666667%}.col-lg-10{width:83.33333333%}.col-lg-9{width:75%}.col-lg-8{width:66.66666667%}.col-lg-7{width:58.33333333%}.col-lg-6{width:50%}.col-lg-5{width:41.66666667%}.col-lg-4{width:33.33333333%}.col-lg-3{width:25%}.col-lg-2{width:16.66666667%}.col-lg-1{width:8.33333333%}.col-lg-pull-12{right:100%}.col-lg-pull-11{right:91.66666667%}.col-lg-pull-10{right:83.33333333%}.col-lg-pull-9{right:75%}.col-lg-pull-8{right:66.66666667%}.col-lg-pull-7{right:58.33333333%}.col-lg-pull-6{right:50%}.col-lg-pull-5{right:41.66666667%}.col-lg-pull-4{right:33.33333333%}.col-lg-pull-3{right:25%}.col-lg-pull-2{right:16.66666667%}.col-lg-pull-1{right:8.33333333%}.col-lg-pull-0{right:auto}.col-lg-push-12{left:100%}.col-lg-push-11{left:91.66666667%}.col-lg-push-10{left:83.33333333%}.col-lg-push-9{left:75%}.col-lg-push-8{left:66.66666667%}.col-lg-push-7{left:58.33333333%}.col-lg-push-6{left:50%}.col-lg-push-5{left:41.66666667%}.col-lg-push-4{left:33.33333333%}.col-lg-push-3{left:25%}.col-lg-push-2{left:16.66666667%}.col-lg-push-1{left:8.33333333%}.col-lg-push-0{left:auto}.col-lg-offset-12{margin-left:100%}.col-lg-offset-11{margin-left:91.66666667%}.col-lg-offset-10{margin-left:83.33333333%}.col-lg-offset-9{margin-left:75%}.col-lg-offset-8{margin-left:66.66666667%}.col-lg-offset-7{margin-left:58.33333333%}.col-lg-offset-6{margin-left:50%}.col-lg-offset-5{margin-left:41.66666667%}.col-lg-offset-4{margin-left:33.33333333%}.col-lg-offset-3{margin-left:25%}.col-lg-offset-2{margin-left:16.66666667%}.col-lg-offset-1{margin-left:8.33333333%}.col-lg-offset-0{margin-left:0}}\ntable{background-color:transparent}\ncaption{padding-top:8px;padding-bottom:8px;color:#777;text-align:left}\nth{text-align:left}\n.table{width:100%;max-width:100%;margin-bottom:20px}\n.table>thead>tr>th,.table>tbody>tr>th,.table>tfoot>tr>th,.table>thead>tr>td,.table>tbody>tr>td,.table>tfoot>tr>td{padding:8px;line-height:1.42857143;vertical-align:top;border-top:1px solid #ddd}\n.table>thead>tr>th{vertical-align:bottom;border-bottom:2px solid #ddd}\n.table>caption+thead>tr:first-child>th,.table>colgroup+thead>tr:first-child>th,.table>thead:first-child>tr:first-child>th,.table>caption+thead>tr:first-child>td,.table>colgroup+thead>tr:first-child>td,.table>thead:first-child>tr:first-child>td{border-top:0}\n.table>tbody+tbody{border-top:2px solid #ddd}\n.table .table{background-color:#fff}\n.table-condensed>thead>tr>th,.table-condensed>tbody>tr>th,.table-condensed>tfoot>tr>th,.table-condensed>thead>tr>td,.table-condensed>tbody>tr>td,.table-condensed>tfoot>tr>td{padding:5px}\n.table-bordered{border:1px solid #ddd}\n.table-bordered>thead>tr>th,.table-bordered>tbody>tr>th,.table-bordered>tfoot>tr>th,.table-bordered>thead>tr>td,.table-bordered>tbody>tr>td,.table-bordered>tfoot>tr>td{border:1px solid #ddd}\n.table-bordered>thead>tr>th,.table-bordered>thead>tr>td{border-bottom-width:2px}\n.table-striped>tbody>tr:nth-of-type(odd){background-color:#f9f9f9}\n.table-hover>tbody>tr:hover{background-color:#f5f5f5}\ntable col[class*=\"col-\"]{position:static;float:none;display:table-column}\ntable td[class*=\"col-\"],table th[class*=\"col-\"]{position:static;float:none;display:table-cell}\n.table>thead>tr>td.active,.table>tbody>tr>td.active,.table>tfoot>tr>td.active,.table>thead>tr>th.active,.table>tbody>tr>th.active,.table>tfoot>tr>th.active,.table>thead>tr.active>td,.table>tbody>tr.active>td,.table>tfoot>tr.active>td,.table>thead>tr.active>th,.table>tbody>tr.active>th,.table>tfoot>tr.active>th{background-color:#f5f5f5}\n.table-hover>tbody>tr>td.active:hover,.table-hover>tbody>tr>th.active:hover,.table-hover>tbody>tr.active:hover>td,.table-hover>tbody>tr:hover>.active,.table-hover>tbody>tr.active:hover>th{background-color:#e8e8e8}\n.table>thead>tr>td.success,.table>tbody>tr>td.success,.table>tfoot>tr>td.success,.table>thead>tr>th.success,.table>tbody>tr>th.success,.table>tfoot>tr>th.success,.table>thead>tr.success>td,.table>tbody>tr.success>td,.table>tfoot>tr.success>td,.table>thead>tr.success>th,.table>tbody>tr.success>th,.table>tfoot>tr.success>th{background-color:#dff0d8}\n.table-hover>tbody>tr>td.success:hover,.table-hover>tbody>tr>th.success:hover,.table-hover>tbody>tr.success:hover>td,.table-hover>tbody>tr:hover>.success,.table-hover>tbody>tr.success:hover>th{background-color:#d0e9c6}\n.table>thead>tr>td.info,.table>tbody>tr>td.info,.table>tfoot>tr>td.info,.table>thead>tr>th.info,.table>tbody>tr>th.info,.table>tfoot>tr>th.info,.table>thead>tr.info>td,.table>tbody>tr.info>td,.table>tfoot>tr.info>td,.table>thead>tr.info>th,.table>tbody>tr.info>th,.table>tfoot>tr.info>th{background-color:#d9edf7}\n.table-hover>tbody>tr>td.info:hover,.table-hover>tbody>tr>th.info:hover,.table-hover>tbody>tr.info:hover>td,.table-hover>tbody>tr:hover>.info,.table-hover>tbody>tr.info:hover>th{background-color:#c4e3f3}\n.table>thead>tr>td.warning,.table>tbody>tr>td.warning,.table>tfoot>tr>td.warning,.table>thead>tr>th.warning,.table>tbody>tr>th.warning,.table>tfoot>tr>th.warning,.table>thead>tr.warning>td,.table>tbody>tr.warning>td,.table>tfoot>tr.warning>td,.table>thead>tr.warning>th,.table>tbody>tr.warning>th,.table>tfoot>tr.warning>th{background-color:#fcf8e3}\n.table-hover>tbody>tr>td.warning:hover,.table-hover>tbody>tr>th.warning:hover,.table-hover>tbody>tr.warning:hover>td,.table-hover>tbody>tr:hover>.warning,.table-hover>tbody>tr.warning:hover>th{background-color:#faf2cc}\n.table>thead>tr>td.danger,.table>tbody>tr>td.danger,.table>tfoot>tr>td.danger,.table>thead>tr>th.danger,.table>tbody>tr>th.danger,.table>tfoot>tr>th.danger,.table>thead>tr.danger>td,.table>tbody>tr.danger>td,.table>tfoot>tr.danger>td,.table>thead>tr.danger>th,.table>tbody>tr.danger>th,.table>tfoot>tr.danger>th{background-color:#f2dede}\n.table-hover>tbody>tr>td.danger:hover,.table-hover>tbody>tr>th.danger:hover,.table-hover>tbody>tr.danger:hover>td,.table-hover>tbody>tr:hover>.danger,.table-hover>tbody>tr.danger:hover>th{background-color:#ebcccc}\n.table-responsive{overflow-x:auto;min-height:0.01%}\n@media screen and (max-width:767px){.table-responsive{width:100%;margin-bottom:15px;overflow-y:hidden;-ms-overflow-style:-ms-autohiding-scrollbar;border:1px solid #ddd}.table-responsive>.table{margin-bottom:0}.table-responsive>.table>thead>tr>th,.table-responsive>.table>tbody>tr>th,.table-responsive>.table>tfoot>tr>th,.table-responsive>.table>thead>tr>td,.table-responsive>.table>tbody>tr>td,.table-responsive>.table>tfoot>tr>td{white-space:nowrap}.table-responsive>.table-bordered{border:0}.table-responsive>.table-bordered>thead>tr>th:first-child,.table-responsive>.table-bordered>tbody>tr>th:first-child,.table-responsive>.table-bordered>tfoot>tr>th:first-child,.table-responsive>.table-bordered>thead>tr>td:first-child,.table-responsive>.table-bordered>tbody>tr>td:first-child,.table-responsive>.table-bordered>tfoot>tr>td:first-child{border-left:0}.table-responsive>.table-bordered>thead>tr>th:last-child,.table-responsive>.table-bordered>tbody>tr>th:last-child,.table-responsive>.table-bordered>tfoot>tr>th:last-child,.table-responsive>.table-bordered>thead>tr>td:last-child,.table-responsive>.table-bordered>tbody>tr>td:last-child,.table-responsive>.table-bordered>tfoot>tr>td:last-child{border-right:0}.table-responsive>.table-bordered>tbody>tr:last-child>th,.table-responsive>.table-bordered>tfoot>tr:last-child>th,.table-responsive>.table-bordered>tbody>tr:last-child>td,.table-responsive>.table-bordered>tfoot>tr:last-child>td{border-bottom:0}}\nfieldset{padding:0;margin:0;border:0;min-width:0}\nlegend{display:block;width:100%;padding:0;margin-bottom:20px;font-size:21px;line-height:inherit;color:#333;border:0;border-bottom:1px solid #e5e5e5}\nlabel{display:inline-block;max-width:100%;margin-bottom:5px;font-weight:bold}\ninput[type=\"search\"]{-webkit-box-sizing:border-box;box-sizing:border-box}\ninput[type=\"radio\"],input[type=\"checkbox\"]{margin:4px 0 0;margin-top:1px \\9;line-height:normal}\ninput[type=\"file\"]{display:block}\ninput[type=\"range\"]{display:block;width:100%}\nselect[multiple],select[size]{height:auto}\ninput[type=\"file\"]:focus,input[type=\"radio\"]:focus,input[type=\"checkbox\"]:focus{outline:5px auto -webkit-focus-ring-color;outline-offset:-2px}\noutput{display:block;padding-top:7px;font-size:14px;line-height:1.42857143;color:#555}\n.form-control{display:block;width:100%;height:34px;padding:6px 12px;font-size:14px;line-height:1.42857143;color:#555;background-color:#fff;background-image:none;border:1px solid #ccc;border-radius:4px;-webkit-box-shadow:inset 0 1px 1px rgba(0, 0, 0, .075);box-shadow:inset 0 1px 1px rgba(0, 0, 0, .075);-webkit-transition:border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;transition:border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;transition:border-color ease-in-out .15s, box-shadow ease-in-out .15s;transition:border-color ease-in-out .15s, box-shadow ease-in-out .15s, -webkit-box-shadow ease-in-out .15s}\n.form-control:focus{border-color:#66afe9;outline:0;-webkit-box-shadow:inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6);box-shadow:inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6)}\n.form-control::-moz-placeholder{color:#999;opacity:1}\n.form-control:-ms-input-placeholder{color:#999}\n.form-control::-webkit-input-placeholder{color:#999}\n.form-control::-ms-expand{border:0;background-color:transparent}\n.form-control[disabled],.form-control[readonly],fieldset[disabled] .form-control{background-color:#eee;opacity:1}\n.form-control[disabled],fieldset[disabled] .form-control{cursor:not-allowed}\ntextarea.form-control{height:auto}\ninput[type=\"search\"]{-webkit-appearance:none}\n@media screen and (-webkit-min-device-pixel-ratio:0){input[type=\"date\"].form-control,input[type=\"time\"].form-control,input[type=\"datetime-local\"].form-control,input[type=\"month\"].form-control{line-height:34px}input[type=\"date\"].input-sm,input[type=\"time\"].input-sm,input[type=\"datetime-local\"].input-sm,input[type=\"month\"].input-sm,.input-group-sm input[type=\"date\"],.input-group-sm input[type=\"time\"],.input-group-sm input[type=\"datetime-local\"],.input-group-sm input[type=\"month\"]{line-height:30px}input[type=\"date\"].input-lg,input[type=\"time\"].input-lg,input[type=\"datetime-local\"].input-lg,input[type=\"month\"].input-lg,.input-group-lg input[type=\"date\"],.input-group-lg input[type=\"time\"],.input-group-lg input[type=\"datetime-local\"],.input-group-lg input[type=\"month\"]{line-height:46px}}\n.form-group{margin-bottom:15px}\n.radio,.checkbox{position:relative;display:block;margin-top:10px;margin-bottom:10px}\n.radio label,.checkbox label{min-height:20px;padding-left:20px;margin-bottom:0;font-weight:normal;cursor:pointer}\n.radio input[type=\"radio\"],.radio-inline input[type=\"radio\"],.checkbox input[type=\"checkbox\"],.checkbox-inline input[type=\"checkbox\"]{position:absolute;margin-left:-20px;margin-top:4px \\9}\n.radio+.radio,.checkbox+.checkbox{margin-top:-5px}\n.radio-inline,.checkbox-inline{position:relative;display:inline-block;padding-left:20px;margin-bottom:0;vertical-align:middle;font-weight:normal;cursor:pointer}\n.radio-inline+.radio-inline,.checkbox-inline+.checkbox-inline{margin-top:0;margin-left:10px}\ninput[type=\"radio\"][disabled],input[type=\"checkbox\"][disabled],input[type=\"radio\"].disabled,input[type=\"checkbox\"].disabled,fieldset[disabled] input[type=\"radio\"],fieldset[disabled] input[type=\"checkbox\"]{cursor:not-allowed}\n.radio-inline.disabled,.checkbox-inline.disabled,fieldset[disabled] .radio-inline,fieldset[disabled] .checkbox-inline{cursor:not-allowed}\n.radio.disabled label,.checkbox.disabled label,fieldset[disabled] .radio label,fieldset[disabled] .checkbox label{cursor:not-allowed}\n.form-control-static{padding-top:7px;padding-bottom:7px;margin-bottom:0;min-height:34px}\n.form-control-static.input-lg,.form-control-static.input-sm{padding-left:0;padding-right:0}\n.input-sm{height:30px;padding:5px 10px;font-size:12px;line-height:1.5;border-radius:3px}\nselect.input-sm{height:30px;line-height:30px}\ntextarea.input-sm,select[multiple].input-sm{height:auto}\n.form-group-sm .form-control{height:30px;padding:5px 10px;font-size:12px;line-height:1.5;border-radius:3px}\n.form-group-sm select.form-control{height:30px;line-height:30px}\n.form-group-sm textarea.form-control,.form-group-sm select[multiple].form-control{height:auto}\n.form-group-sm .form-control-static{height:30px;min-height:32px;padding:6px 10px;font-size:12px;line-height:1.5}\n.input-lg{height:46px;padding:10px 16px;font-size:18px;line-height:1.3333333;border-radius:6px}\nselect.input-lg{height:46px;line-height:46px}\ntextarea.input-lg,select[multiple].input-lg{height:auto}\n.form-group-lg .form-control{height:46px;padding:10px 16px;font-size:18px;line-height:1.3333333;border-radius:6px}\n.form-group-lg select.form-control{height:46px;line-height:46px}\n.form-group-lg textarea.form-control,.form-group-lg select[multiple].form-control{height:auto}\n.form-group-lg .form-control-static{height:46px;min-height:38px;padding:11px 16px;font-size:18px;line-height:1.3333333}\n.has-feedback{position:relative}\n.has-feedback .form-control{padding-right:42.5px}\n.form-control-feedback{position:absolute;top:0;right:0;z-index:2;display:block;width:34px;height:34px;line-height:34px;text-align:center;pointer-events:none}\n.input-lg+.form-control-feedback,.input-group-lg+.form-control-feedback,.form-group-lg .form-control+.form-control-feedback{width:46px;height:46px;line-height:46px}\n.input-sm+.form-control-feedback,.input-group-sm+.form-control-feedback,.form-group-sm .form-control+.form-control-feedback{width:30px;height:30px;line-height:30px}\n.has-success .help-block,.has-success .control-label,.has-success .radio,.has-success .checkbox,.has-success .radio-inline,.has-success .checkbox-inline,.has-success.radio label,.has-success.checkbox label,.has-success.radio-inline label,.has-success.checkbox-inline label{color:#3c763d}\n.has-success .form-control{border-color:#3c763d;-webkit-box-shadow:inset 0 1px 1px rgba(0, 0, 0, .075);box-shadow:inset 0 1px 1px rgba(0, 0, 0, .075)}\n.has-success .form-control:focus{border-color:#2b542c;-webkit-box-shadow:inset 0 1px 1px rgba(0, 0, 0, .075),0 0 6px #67b168;box-shadow:inset 0 1px 1px rgba(0, 0, 0, .075),0 0 6px #67b168}\n.has-success .input-group-addon{color:#3c763d;border-color:#3c763d;background-color:#dff0d8}\n.has-success .form-control-feedback{color:#3c763d}\n.has-warning .help-block,.has-warning .control-label,.has-warning .radio,.has-warning .checkbox,.has-warning .radio-inline,.has-warning .checkbox-inline,.has-warning.radio label,.has-warning.checkbox label,.has-warning.radio-inline label,.has-warning.checkbox-inline label{color:#8a6d3b}\n.has-warning .form-control{border-color:#8a6d3b;-webkit-box-shadow:inset 0 1px 1px rgba(0, 0, 0, .075);box-shadow:inset 0 1px 1px rgba(0, 0, 0, .075)}\n.has-warning .form-control:focus{border-color:#66512c;-webkit-box-shadow:inset 0 1px 1px rgba(0, 0, 0, .075),0 0 6px #c0a16b;box-shadow:inset 0 1px 1px rgba(0, 0, 0, .075),0 0 6px #c0a16b}\n.has-warning .input-group-addon{color:#8a6d3b;border-color:#8a6d3b;background-color:#fcf8e3}\n.has-warning .form-control-feedback{color:#8a6d3b}\n.has-error .help-block,.has-error .control-label,.has-error .radio,.has-error .checkbox,.has-error .radio-inline,.has-error .checkbox-inline,.has-error.radio label,.has-error.checkbox label,.has-error.radio-inline label,.has-error.checkbox-inline label{color:#a94442}\n.has-error .form-control{border-color:#a94442;-webkit-box-shadow:inset 0 1px 1px rgba(0, 0, 0, .075);box-shadow:inset 0 1px 1px rgba(0, 0, 0, .075)}\n.has-error .form-control:focus{border-color:#843534;-webkit-box-shadow:inset 0 1px 1px rgba(0, 0, 0, .075),0 0 6px #ce8483;box-shadow:inset 0 1px 1px rgba(0, 0, 0, .075),0 0 6px #ce8483}\n.has-error .input-group-addon{color:#a94442;border-color:#a94442;background-color:#f2dede}\n.has-error .form-control-feedback{color:#a94442}\n.has-feedback label~.form-control-feedback{top:25px}\n.has-feedback label.sr-only~.form-control-feedback{top:0}\n.help-block{display:block;margin-top:5px;margin-bottom:10px;color:#737373}\n@media (min-width:768px){.form-inline .form-group{display:inline-block;margin-bottom:0;vertical-align:middle}.form-inline .form-control{display:inline-block;width:auto;vertical-align:middle}.form-inline .form-control-static{display:inline-block}.form-inline .input-group{display:inline-table;vertical-align:middle}.form-inline .input-group .input-group-addon,.form-inline .input-group .input-group-btn,.form-inline .input-group .form-control{width:auto}.form-inline .input-group>.form-control{width:100%}.form-inline .control-label{margin-bottom:0;vertical-align:middle}.form-inline .radio,.form-inline .checkbox{display:inline-block;margin-top:0;margin-bottom:0;vertical-align:middle}.form-inline .radio label,.form-inline .checkbox label{padding-left:0}.form-inline .radio input[type=\"radio\"],.form-inline .checkbox input[type=\"checkbox\"]{position:relative;margin-left:0}.form-inline .has-feedback .form-control-feedback{top:0}}\n.form-horizontal .radio,.form-horizontal .checkbox,.form-horizontal .radio-inline,.form-horizontal .checkbox-inline{margin-top:0;margin-bottom:0;padding-top:7px}\n.form-horizontal .radio,.form-horizontal .checkbox{min-height:27px}\n.form-horizontal .form-group{margin-left:-15px;margin-right:-15px}\n@media (min-width:768px){.form-horizontal .control-label{text-align:right;margin-bottom:0;padding-top:7px}}\n.form-horizontal .has-feedback .form-control-feedback{right:15px}\n@media (min-width:768px){.form-horizontal .form-group-lg .control-label{padding-top:11px;font-size:18px}}\n@media (min-width:768px){.form-horizontal .form-group-sm .control-label{padding-top:6px;font-size:12px}}\n.btn{display:inline-block;margin-bottom:0;font-weight:normal;text-align:center;vertical-align:middle;-ms-touch-action:manipulation;touch-action:manipulation;cursor:pointer;background-image:none;border:1px solid transparent;white-space:nowrap;padding:6px 12px;font-size:14px;line-height:1.42857143;border-radius:4px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}\n.btn:focus,.btn:active:focus,.btn.active:focus,.btn.focus,.btn:active.focus,.btn.active.focus{outline:5px auto -webkit-focus-ring-color;outline-offset:-2px}\n.btn:hover,.btn:focus,.btn.focus{color:#333;text-decoration:none}\n.btn:active,.btn.active{outline:0;background-image:none;-webkit-box-shadow:inset 0 3px 5px rgba(0, 0, 0, .125);box-shadow:inset 0 3px 5px rgba(0, 0, 0, .125)}\n.btn.disabled,.btn[disabled],fieldset[disabled] .btn{cursor:not-allowed;opacity:.65;filter:alpha(opacity=65);-webkit-box-shadow:none;box-shadow:none}\na.btn.disabled,fieldset[disabled] a.btn{pointer-events:none}\n.btn-default{color:#333;background-color:#fff;border-color:#ccc}\n.btn-default:focus,.btn-default.focus{color:#333;background-color:#e6e6e6;border-color:#8c8c8c}\n.btn-default:hover{color:#333;background-color:#e6e6e6;border-color:#adadad}\n.btn-default:active,.btn-default.active,.open>.dropdown-toggle.btn-default{color:#333;background-color:#e6e6e6;border-color:#adadad}\n.btn-default:active:hover,.btn-default.active:hover,.open>.dropdown-toggle.btn-default:hover,.btn-default:active:focus,.btn-default.active:focus,.open>.dropdown-toggle.btn-default:focus,.btn-default:active.focus,.btn-default.active.focus,.open>.dropdown-toggle.btn-default.focus{color:#333;background-color:#d4d4d4;border-color:#8c8c8c}\n.btn-default:active,.btn-default.active,.open>.dropdown-toggle.btn-default{background-image:none}\n.btn-default.disabled:hover,.btn-default[disabled]:hover,fieldset[disabled] .btn-default:hover,.btn-default.disabled:focus,.btn-default[disabled]:focus,fieldset[disabled] .btn-default:focus,.btn-default.disabled.focus,.btn-default[disabled].focus,fieldset[disabled] .btn-default.focus{background-color:#fff;border-color:#ccc}\n.btn-default .badge{color:#fff;background-color:#333}\n.btn-primary{color:#fff;background-color:#337ab7;border-color:#2e6da4}\n.btn-primary:focus,.btn-primary.focus{color:#fff;background-color:#286090;border-color:#122b40}\n.btn-primary:hover{color:#fff;background-color:#286090;border-color:#204d74}\n.btn-primary:active,.btn-primary.active,.open>.dropdown-toggle.btn-primary{color:#fff;background-color:#286090;border-color:#204d74}\n.btn-primary:active:hover,.btn-primary.active:hover,.open>.dropdown-toggle.btn-primary:hover,.btn-primary:active:focus,.btn-primary.active:focus,.open>.dropdown-toggle.btn-primary:focus,.btn-primary:active.focus,.btn-primary.active.focus,.open>.dropdown-toggle.btn-primary.focus{color:#fff;background-color:#204d74;border-color:#122b40}\n.btn-primary:active,.btn-primary.active,.open>.dropdown-toggle.btn-primary{background-image:none}\n.btn-primary.disabled:hover,.btn-primary[disabled]:hover,fieldset[disabled] .btn-primary:hover,.btn-primary.disabled:focus,.btn-primary[disabled]:focus,fieldset[disabled] .btn-primary:focus,.btn-primary.disabled.focus,.btn-primary[disabled].focus,fieldset[disabled] .btn-primary.focus{background-color:#337ab7;border-color:#2e6da4}\n.btn-primary .badge{color:#337ab7;background-color:#fff}\n.btn-success{color:#fff;background-color:#5cb85c;border-color:#4cae4c}\n.btn-success:focus,.btn-success.focus{color:#fff;background-color:#449d44;border-color:#255625}\n.btn-success:hover{color:#fff;background-color:#449d44;border-color:#398439}\n.btn-success:active,.btn-success.active,.open>.dropdown-toggle.btn-success{color:#fff;background-color:#449d44;border-color:#398439}\n.btn-success:active:hover,.btn-success.active:hover,.open>.dropdown-toggle.btn-success:hover,.btn-success:active:focus,.btn-success.active:focus,.open>.dropdown-toggle.btn-success:focus,.btn-success:active.focus,.btn-success.active.focus,.open>.dropdown-toggle.btn-success.focus{color:#fff;background-color:#398439;border-color:#255625}\n.btn-success:active,.btn-success.active,.open>.dropdown-toggle.btn-success{background-image:none}\n.btn-success.disabled:hover,.btn-success[disabled]:hover,fieldset[disabled] .btn-success:hover,.btn-success.disabled:focus,.btn-success[disabled]:focus,fieldset[disabled] .btn-success:focus,.btn-success.disabled.focus,.btn-success[disabled].focus,fieldset[disabled] .btn-success.focus{background-color:#5cb85c;border-color:#4cae4c}\n.btn-success .badge{color:#5cb85c;background-color:#fff}\n.btn-info{color:#fff;background-color:#5bc0de;border-color:#46b8da}\n.btn-info:focus,.btn-info.focus{color:#fff;background-color:#31b0d5;border-color:#1b6d85}\n.btn-info:hover{color:#fff;background-color:#31b0d5;border-color:#269abc}\n.btn-info:active,.btn-info.active,.open>.dropdown-toggle.btn-info{color:#fff;background-color:#31b0d5;border-color:#269abc}\n.btn-info:active:hover,.btn-info.active:hover,.open>.dropdown-toggle.btn-info:hover,.btn-info:active:focus,.btn-info.active:focus,.open>.dropdown-toggle.btn-info:focus,.btn-info:active.focus,.btn-info.active.focus,.open>.dropdown-toggle.btn-info.focus{color:#fff;background-color:#269abc;border-color:#1b6d85}\n.btn-info:active,.btn-info.active,.open>.dropdown-toggle.btn-info{background-image:none}\n.btn-info.disabled:hover,.btn-info[disabled]:hover,fieldset[disabled] .btn-info:hover,.btn-info.disabled:focus,.btn-info[disabled]:focus,fieldset[disabled] .btn-info:focus,.btn-info.disabled.focus,.btn-info[disabled].focus,fieldset[disabled] .btn-info.focus{background-color:#5bc0de;border-color:#46b8da}\n.btn-info .badge{color:#5bc0de;background-color:#fff}\n.btn-warning{color:#fff;background-color:#f0ad4e;border-color:#eea236}\n.btn-warning:focus,.btn-warning.focus{color:#fff;background-color:#ec971f;border-color:#985f0d}\n.btn-warning:hover{color:#fff;background-color:#ec971f;border-color:#d58512}\n.btn-warning:active,.btn-warning.active,.open>.dropdown-toggle.btn-warning{color:#fff;background-color:#ec971f;border-color:#d58512}\n.btn-warning:active:hover,.btn-warning.active:hover,.open>.dropdown-toggle.btn-warning:hover,.btn-warning:active:focus,.btn-warning.active:focus,.open>.dropdown-toggle.btn-warning:focus,.btn-warning:active.focus,.btn-warning.active.focus,.open>.dropdown-toggle.btn-warning.focus{color:#fff;background-color:#d58512;border-color:#985f0d}\n.btn-warning:active,.btn-warning.active,.open>.dropdown-toggle.btn-warning{background-image:none}\n.btn-warning.disabled:hover,.btn-warning[disabled]:hover,fieldset[disabled] .btn-warning:hover,.btn-warning.disabled:focus,.btn-warning[disabled]:focus,fieldset[disabled] .btn-warning:focus,.btn-warning.disabled.focus,.btn-warning[disabled].focus,fieldset[disabled] .btn-warning.focus{background-color:#f0ad4e;border-color:#eea236}\n.btn-warning .badge{color:#f0ad4e;background-color:#fff}\n.btn-danger{color:#fff;background-color:#d9534f;border-color:#d43f3a}\n.btn-danger:focus,.btn-danger.focus{color:#fff;background-color:#c9302c;border-color:#761c19}\n.btn-danger:hover{color:#fff;background-color:#c9302c;border-color:#ac2925}\n.btn-danger:active,.btn-danger.active,.open>.dropdown-toggle.btn-danger{color:#fff;background-color:#c9302c;border-color:#ac2925}\n.btn-danger:active:hover,.btn-danger.active:hover,.open>.dropdown-toggle.btn-danger:hover,.btn-danger:active:focus,.btn-danger.active:focus,.open>.dropdown-toggle.btn-danger:focus,.btn-danger:active.focus,.btn-danger.active.focus,.open>.dropdown-toggle.btn-danger.focus{color:#fff;background-color:#ac2925;border-color:#761c19}\n.btn-danger:active,.btn-danger.active,.open>.dropdown-toggle.btn-danger{background-image:none}\n.btn-danger.disabled:hover,.btn-danger[disabled]:hover,fieldset[disabled] .btn-danger:hover,.btn-danger.disabled:focus,.btn-danger[disabled]:focus,fieldset[disabled] .btn-danger:focus,.btn-danger.disabled.focus,.btn-danger[disabled].focus,fieldset[disabled] .btn-danger.focus{background-color:#d9534f;border-color:#d43f3a}\n.btn-danger .badge{color:#d9534f;background-color:#fff}\n.btn-link{color:#337ab7;font-weight:normal;border-radius:0}\n.btn-link,.btn-link:active,.btn-link.active,.btn-link[disabled],fieldset[disabled] .btn-link{background-color:transparent;-webkit-box-shadow:none;box-shadow:none}\n.btn-link,.btn-link:hover,.btn-link:focus,.btn-link:active{border-color:transparent}\n.btn-link:hover,.btn-link:focus{color:#23527c;text-decoration:underline;background-color:transparent}\n.btn-link[disabled]:hover,fieldset[disabled] .btn-link:hover,.btn-link[disabled]:focus,fieldset[disabled] .btn-link:focus{color:#777;text-decoration:none}\n.btn-lg,.btn-group-lg>.btn{padding:10px 16px;font-size:18px;line-height:1.3333333;border-radius:6px}\n.btn-sm,.btn-group-sm>.btn{padding:5px 10px;font-size:12px;line-height:1.5;border-radius:3px}\n.btn-xs,.btn-group-xs>.btn{padding:1px 5px;font-size:12px;line-height:1.5;border-radius:3px}\n.btn-block{display:block;width:100%}\n.btn-block+.btn-block{margin-top:5px}\ninput[type=\"submit\"].btn-block,input[type=\"reset\"].btn-block,input[type=\"button\"].btn-block{width:100%}\n.btn-group,.btn-group-vertical{position:relative;display:inline-block;vertical-align:middle}\n.btn-group>.btn,.btn-group-vertical>.btn{position:relative;float:left}\n.btn-group>.btn:hover,.btn-group-vertical>.btn:hover,.btn-group>.btn:focus,.btn-group-vertical>.btn:focus,.btn-group>.btn:active,.btn-group-vertical>.btn:active,.btn-group>.btn.active,.btn-group-vertical>.btn.active{z-index:2}\n.btn-group .btn+.btn,.btn-group .btn+.btn-group,.btn-group .btn-group+.btn,.btn-group .btn-group+.btn-group{margin-left:-1px}\n.btn-toolbar{margin-left:-5px}\n.btn-toolbar .btn,.btn-toolbar .btn-group,.btn-toolbar .input-group{float:left}\n.btn-toolbar>.btn,.btn-toolbar>.btn-group,.btn-toolbar>.input-group{margin-left:5px}\n.btn-group>.btn:not(:first-child):not(:last-child):not(.dropdown-toggle){border-radius:0}\n.btn-group>.btn:first-child{margin-left:0}\n.btn-group>.btn:first-child:not(:last-child):not(.dropdown-toggle){border-bottom-right-radius:0;border-top-right-radius:0}\n.btn-group>.btn:last-child:not(:first-child),.btn-group>.dropdown-toggle:not(:first-child){border-bottom-left-radius:0;border-top-left-radius:0}\n.btn-group>.btn-group{float:left}\n.btn-group>.btn-group:not(:first-child):not(:last-child)>.btn{border-radius:0}\n.btn-group>.btn-group:first-child:not(:last-child)>.btn:last-child,.btn-group>.btn-group:first-child:not(:last-child)>.dropdown-toggle{border-bottom-right-radius:0;border-top-right-radius:0}\n.btn-group>.btn-group:last-child:not(:first-child)>.btn:first-child{border-bottom-left-radius:0;border-top-left-radius:0}\n.btn-group .dropdown-toggle:active,.btn-group.open .dropdown-toggle{outline:0}\n.btn-group>.btn+.dropdown-toggle{padding-left:8px;padding-right:8px}\n.btn-group>.btn-lg+.dropdown-toggle{padding-left:12px;padding-right:12px}\n.btn-group.open .dropdown-toggle{-webkit-box-shadow:inset 0 3px 5px rgba(0, 0, 0, .125);box-shadow:inset 0 3px 5px rgba(0, 0, 0, .125)}\n.btn-group.open .dropdown-toggle.btn-link{-webkit-box-shadow:none;box-shadow:none}\n.btn .caret{margin-left:0}\n.btn-lg .caret{border-width:5px 5px 0;border-bottom-width:0}\n.dropup .btn-lg .caret{border-width:0 5px 5px}\n.btn-group-vertical>.btn,.btn-group-vertical>.btn-group,.btn-group-vertical>.btn-group>.btn{display:block;float:none;width:100%;max-width:100%}\n.btn-group-vertical>.btn-group>.btn{float:none}\n.btn-group-vertical>.btn+.btn,.btn-group-vertical>.btn+.btn-group,.btn-group-vertical>.btn-group+.btn,.btn-group-vertical>.btn-group+.btn-group{margin-top:-1px;margin-left:0}\n.btn-group-vertical>.btn:not(:first-child):not(:last-child){border-radius:0}\n.btn-group-vertical>.btn:first-child:not(:last-child){border-top-right-radius:4px;border-top-left-radius:4px;border-bottom-right-radius:0;border-bottom-left-radius:0}\n.btn-group-vertical>.btn:last-child:not(:first-child){border-top-right-radius:0;border-top-left-radius:0;border-bottom-right-radius:4px;border-bottom-left-radius:4px}\n.btn-group-vertical>.btn-group:not(:first-child):not(:last-child)>.btn{border-radius:0}\n.btn-group-vertical>.btn-group:first-child:not(:last-child)>.btn:last-child,.btn-group-vertical>.btn-group:first-child:not(:last-child)>.dropdown-toggle{border-bottom-right-radius:0;border-bottom-left-radius:0}\n.btn-group-vertical>.btn-group:last-child:not(:first-child)>.btn:first-child{border-top-right-radius:0;border-top-left-radius:0}\n.btn-group-justified{display:table;width:100%;table-layout:fixed;border-collapse:separate}\n.btn-group-justified>.btn,.btn-group-justified>.btn-group{float:none;display:table-cell;width:1%}\n.btn-group-justified>.btn-group .btn{width:100%}\n.btn-group-justified>.btn-group .dropdown-menu{left:auto}\n[data-toggle=\"buttons\"]>.btn input[type=\"radio\"],[data-toggle=\"buttons\"]>.btn-group>.btn input[type=\"radio\"],[data-toggle=\"buttons\"]>.btn input[type=\"checkbox\"],[data-toggle=\"buttons\"]>.btn-group>.btn input[type=\"checkbox\"]{position:absolute;clip:rect(0, 0, 0, 0);pointer-events:none}\n.input-group{position:relative;display:table;border-collapse:separate}\n.input-group[class*=\"col-\"]{float:none;padding-left:0;padding-right:0}\n.input-group .form-control{position:relative;z-index:2;float:left;width:100%;margin-bottom:0}\n.input-group .form-control:focus{z-index:3}\n.input-group-lg>.form-control,.input-group-lg>.input-group-addon,.input-group-lg>.input-group-btn>.btn{height:46px;padding:10px 16px;font-size:18px;line-height:1.3333333;border-radius:6px}\nselect.input-group-lg>.form-control,select.input-group-lg>.input-group-addon,select.input-group-lg>.input-group-btn>.btn{height:46px;line-height:46px}\ntextarea.input-group-lg>.form-control,textarea.input-group-lg>.input-group-addon,textarea.input-group-lg>.input-group-btn>.btn,select[multiple].input-group-lg>.form-control,select[multiple].input-group-lg>.input-group-addon,select[multiple].input-group-lg>.input-group-btn>.btn{height:auto}\n.input-group-sm>.form-control,.input-group-sm>.input-group-addon,.input-group-sm>.input-group-btn>.btn{height:30px;padding:5px 10px;font-size:12px;line-height:1.5;border-radius:3px}\nselect.input-group-sm>.form-control,select.input-group-sm>.input-group-addon,select.input-group-sm>.input-group-btn>.btn{height:30px;line-height:30px}\ntextarea.input-group-sm>.form-control,textarea.input-group-sm>.input-group-addon,textarea.input-group-sm>.input-group-btn>.btn,select[multiple].input-group-sm>.form-control,select[multiple].input-group-sm>.input-group-addon,select[multiple].input-group-sm>.input-group-btn>.btn{height:auto}\n.input-group-addon,.input-group-btn,.input-group .form-control{display:table-cell}\n.input-group-addon:not(:first-child):not(:last-child),.input-group-btn:not(:first-child):not(:last-child),.input-group .form-control:not(:first-child):not(:last-child){border-radius:0}\n.input-group-addon,.input-group-btn{width:1%;white-space:nowrap;vertical-align:middle}\n.input-group-addon{padding:6px 12px;font-size:14px;font-weight:normal;line-height:1;color:#555;text-align:center;background-color:#eee;border:1px solid #ccc;border-radius:4px}\n.input-group-addon.input-sm{padding:5px 10px;font-size:12px;border-radius:3px}\n.input-group-addon.input-lg{padding:10px 16px;font-size:18px;border-radius:6px}\n.input-group-addon input[type=\"radio\"],.input-group-addon input[type=\"checkbox\"]{margin-top:0}\n.input-group .form-control:first-child,.input-group-addon:first-child,.input-group-btn:first-child>.btn,.input-group-btn:first-child>.btn-group>.btn,.input-group-btn:first-child>.dropdown-toggle,.input-group-btn:last-child>.btn:not(:last-child):not(.dropdown-toggle),.input-group-btn:last-child>.btn-group:not(:last-child)>.btn{border-bottom-right-radius:0;border-top-right-radius:0}\n.input-group-addon:first-child{border-right:0}\n.input-group .form-control:last-child,.input-group-addon:last-child,.input-group-btn:last-child>.btn,.input-group-btn:last-child>.btn-group>.btn,.input-group-btn:last-child>.dropdown-toggle,.input-group-btn:first-child>.btn:not(:first-child),.input-group-btn:first-child>.btn-group:not(:first-child)>.btn{border-bottom-left-radius:0;border-top-left-radius:0}\n.input-group-addon:last-child{border-left:0}\n.input-group-btn{position:relative;font-size:0;white-space:nowrap}\n.input-group-btn>.btn{position:relative}\n.input-group-btn>.btn+.btn{margin-left:-1px}\n.input-group-btn>.btn:hover,.input-group-btn>.btn:focus,.input-group-btn>.btn:active{z-index:2}\n.input-group-btn:first-child>.btn,.input-group-btn:first-child>.btn-group{margin-right:-1px}\n.input-group-btn:last-child>.btn,.input-group-btn:last-child>.btn-group{z-index:2;margin-left:-1px}\n.nav{margin-bottom:0;padding-left:0;list-style:none}\n.nav>li{position:relative;display:block}\n.nav>li>a{position:relative;display:block;padding:10px 15px}\n.nav>li>a:hover,.nav>li>a:focus{text-decoration:none;background-color:#eee}\n.nav>li.disabled>a{color:#777}\n.nav>li.disabled>a:hover,.nav>li.disabled>a:focus{color:#777;text-decoration:none;background-color:transparent;cursor:not-allowed}\n.nav .open>a,.nav .open>a:hover,.nav .open>a:focus{background-color:#eee;border-color:#337ab7}\n.nav .nav-divider{height:1px;margin:9px 0;overflow:hidden;background-color:#e5e5e5}\n.nav>li>a>img{max-width:none}\n.nav-tabs{border-bottom:1px solid #ddd}\n.nav-tabs>li{float:left;margin-bottom:-1px}\n.nav-tabs>li>a{margin-right:2px;line-height:1.42857143;border:1px solid transparent;border-radius:4px 4px 0 0}\n.nav-tabs>li>a:hover{border-color:#eee #eee #ddd}\n.nav-tabs>li.active>a,.nav-tabs>li.active>a:hover,.nav-tabs>li.active>a:focus{color:#555;background-color:#fff;border:1px solid #ddd;border-bottom-color:transparent;cursor:default}\n.nav-tabs.nav-justified{width:100%;border-bottom:0}\n.nav-tabs.nav-justified>li{float:none}\n.nav-tabs.nav-justified>li>a{text-align:center;margin-bottom:5px}\n.nav-tabs.nav-justified>.dropdown .dropdown-menu{top:auto;left:auto}\n@media (min-width:768px){.nav-tabs.nav-justified>li{display:table-cell;width:1%}.nav-tabs.nav-justified>li>a{margin-bottom:0}}\n.nav-tabs.nav-justified>li>a{margin-right:0;border-radius:4px}\n.nav-tabs.nav-justified>.active>a,.nav-tabs.nav-justified>.active>a:hover,.nav-tabs.nav-justified>.active>a:focus{border:1px solid #ddd}\n@media (min-width:768px){.nav-tabs.nav-justified>li>a{border-bottom:1px solid #ddd;border-radius:4px 4px 0 0}.nav-tabs.nav-justified>.active>a,.nav-tabs.nav-justified>.active>a:hover,.nav-tabs.nav-justified>.active>a:focus{border-bottom-color:#fff}}\n.nav-pills>li{float:left}\n.nav-pills>li>a{border-radius:4px}\n.nav-pills>li+li{margin-left:2px}\n.nav-pills>li.active>a,.nav-pills>li.active>a:hover,.nav-pills>li.active>a:focus{color:#fff;background-color:#337ab7}\n.nav-stacked>li{float:none}\n.nav-stacked>li+li{margin-top:2px;margin-left:0}\n.nav-justified{width:100%}\n.nav-justified>li{float:none}\n.nav-justified>li>a{text-align:center;margin-bottom:5px}\n.nav-justified>.dropdown .dropdown-menu{top:auto;left:auto}\n@media (min-width:768px){.nav-justified>li{display:table-cell;width:1%}.nav-justified>li>a{margin-bottom:0}}\n.nav-tabs-justified{border-bottom:0}\n.nav-tabs-justified>li>a{margin-right:0;border-radius:4px}\n.nav-tabs-justified>.active>a,.nav-tabs-justified>.active>a:hover,.nav-tabs-justified>.active>a:focus{border:1px solid #ddd}\n@media (min-width:768px){.nav-tabs-justified>li>a{border-bottom:1px solid #ddd;border-radius:4px 4px 0 0}.nav-tabs-justified>.active>a,.nav-tabs-justified>.active>a:hover,.nav-tabs-justified>.active>a:focus{border-bottom-color:#fff}}\n.tab-content>.tab-pane{display:none}\n.tab-content>.active{display:block}\n.nav-tabs .dropdown-menu{margin-top:-1px;border-top-right-radius:0;border-top-left-radius:0}\n.navbar{position:relative;min-height:50px;margin-bottom:20px;border:1px solid transparent}\n@media (min-width:768px){.navbar{border-radius:4px}}\n@media (min-width:768px){.navbar-header{float:left}}\n.navbar-collapse{overflow-x:visible;padding-right:15px;padding-left:15px;border-top:1px solid transparent;-webkit-box-shadow:inset 0 1px 0 rgba(255, 255, 255, .1);box-shadow:inset 0 1px 0 rgba(255, 255, 255, .1);-webkit-overflow-scrolling:touch}\n.navbar-collapse.in{overflow-y:auto}\n@media (min-width:768px){.navbar-collapse{width:auto;border-top:0;-webkit-box-shadow:none;box-shadow:none}.navbar-collapse.collapse{display:block !important;height:auto !important;padding-bottom:0;overflow:visible !important}.navbar-collapse.in{overflow-y:visible}.navbar-fixed-top .navbar-collapse,.navbar-static-top .navbar-collapse,.navbar-fixed-bottom .navbar-collapse{padding-left:0;padding-right:0}}\n.navbar-fixed-top .navbar-collapse,.navbar-fixed-bottom .navbar-collapse{max-height:340px}\n@media (max-device-width:480px) and (orientation:landscape){.navbar-fixed-top .navbar-collapse,.navbar-fixed-bottom .navbar-collapse{max-height:200px}}\n.container>.navbar-header,.container-fluid>.navbar-header,.container>.navbar-collapse,.container-fluid>.navbar-collapse{margin-right:-15px;margin-left:-15px}\n@media (min-width:768px){.container>.navbar-header,.container-fluid>.navbar-header,.container>.navbar-collapse,.container-fluid>.navbar-collapse{margin-right:0;margin-left:0}}\n.navbar-static-top{z-index:1000;border-width:0 0 1px}\n@media (min-width:768px){.navbar-static-top{border-radius:0}}\n.navbar-fixed-top,.navbar-fixed-bottom{position:fixed;right:0;left:0;z-index:1030}\n@media (min-width:768px){.navbar-fixed-top,.navbar-fixed-bottom{border-radius:0}}\n.navbar-fixed-top{top:0;border-width:0 0 1px}\n.navbar-fixed-bottom{bottom:0;margin-bottom:0;border-width:1px 0 0}\n.navbar-brand{float:left;padding:15px 15px;font-size:18px;line-height:20px;height:50px}\n.navbar-brand:hover,.navbar-brand:focus{text-decoration:none}\n.navbar-brand>img{display:block}\n@media (min-width:768px){.navbar>.container .navbar-brand,.navbar>.container-fluid .navbar-brand{margin-left:-15px}}\n.navbar-toggle{position:relative;float:right;margin-right:15px;padding:9px 10px;margin-top:8px;margin-bottom:8px;background-color:transparent;background-image:none;border:1px solid transparent;border-radius:4px}\n.navbar-toggle:focus{outline:0}\n.navbar-toggle .icon-bar{display:block;width:22px;height:2px;border-radius:1px}\n.navbar-toggle .icon-bar+.icon-bar{margin-top:4px}\n@media (min-width:768px){.navbar-toggle{display:none}}\n.navbar-nav{margin:7.5px -15px}\n.navbar-nav>li>a{padding-top:10px;padding-bottom:10px;line-height:20px}\n@media (max-width:767px){.navbar-nav .open .dropdown-menu{position:static;float:none;width:auto;margin-top:0;background-color:transparent;border:0;-webkit-box-shadow:none;box-shadow:none}.navbar-nav .open .dropdown-menu>li>a,.navbar-nav .open .dropdown-menu .dropdown-header{padding:5px 15px 5px 25px}.navbar-nav .open .dropdown-menu>li>a{line-height:20px}.navbar-nav .open .dropdown-menu>li>a:hover,.navbar-nav .open .dropdown-menu>li>a:focus{background-image:none}}\n@media (min-width:768px){.navbar-nav{float:left;margin:0}.navbar-nav>li{float:left}.navbar-nav>li>a{padding-top:15px;padding-bottom:15px}}\n.navbar-form{margin-left:-15px;margin-right:-15px;padding:10px 15px;border-top:1px solid transparent;border-bottom:1px solid transparent;-webkit-box-shadow:inset 0 1px 0 rgba(255, 255, 255, .1),0 1px 0 rgba(255, 255, 255, .1);box-shadow:inset 0 1px 0 rgba(255, 255, 255, .1),0 1px 0 rgba(255, 255, 255, .1);margin-top:8px;margin-bottom:8px}\n@media (min-width:768px){.navbar-form .form-group{display:inline-block;margin-bottom:0;vertical-align:middle}.navbar-form .form-control{display:inline-block;width:auto;vertical-align:middle}.navbar-form .form-control-static{display:inline-block}.navbar-form .input-group{display:inline-table;vertical-align:middle}.navbar-form .input-group .input-group-addon,.navbar-form .input-group .input-group-btn,.navbar-form .input-group .form-control{width:auto}.navbar-form .input-group>.form-control{width:100%}.navbar-form .control-label{margin-bottom:0;vertical-align:middle}.navbar-form .radio,.navbar-form .checkbox{display:inline-block;margin-top:0;margin-bottom:0;vertical-align:middle}.navbar-form .radio label,.navbar-form .checkbox label{padding-left:0}.navbar-form .radio input[type=\"radio\"],.navbar-form .checkbox input[type=\"checkbox\"]{position:relative;margin-left:0}.navbar-form .has-feedback .form-control-feedback{top:0}}\n@media (max-width:767px){.navbar-form .form-group{margin-bottom:5px}.navbar-form .form-group:last-child{margin-bottom:0}}\n@media (min-width:768px){.navbar-form{width:auto;border:0;margin-left:0;margin-right:0;padding-top:0;padding-bottom:0;-webkit-box-shadow:none;box-shadow:none}}\n.navbar-nav>li>.dropdown-menu{margin-top:0;border-top-right-radius:0;border-top-left-radius:0}\n.navbar-fixed-bottom .navbar-nav>li>.dropdown-menu{margin-bottom:0;border-top-right-radius:4px;border-top-left-radius:4px;border-bottom-right-radius:0;border-bottom-left-radius:0}\n.navbar-btn{margin-top:8px;margin-bottom:8px}\n.navbar-btn.btn-sm{margin-top:10px;margin-bottom:10px}\n.navbar-btn.btn-xs{margin-top:14px;margin-bottom:14px}\n.navbar-text{margin-top:15px;margin-bottom:15px}\n@media (min-width:768px){.navbar-text{float:left;margin-left:15px;margin-right:15px}}\n@media (min-width:768px){.navbar-left{float:left !important}.navbar-right{float:right !important;margin-right:-15px}.navbar-right~.navbar-right{margin-right:0}}\n.navbar-default{background-color:#f8f8f8;border-color:#e7e7e7}\n.navbar-default .navbar-brand{color:#777}\n.navbar-default .navbar-brand:hover,.navbar-default .navbar-brand:focus{color:#5e5e5e;background-color:transparent}\n.navbar-default .navbar-text{color:#777}\n.navbar-default .navbar-nav>li>a{color:#777}\n.navbar-default .navbar-nav>li>a:hover,.navbar-default .navbar-nav>li>a:focus{color:#333;background-color:transparent}\n.navbar-default .navbar-nav>.active>a,.navbar-default .navbar-nav>.active>a:hover,.navbar-default .navbar-nav>.active>a:focus{color:#555;background-color:#e7e7e7}\n.navbar-default .navbar-nav>.disabled>a,.navbar-default .navbar-nav>.disabled>a:hover,.navbar-default .navbar-nav>.disabled>a:focus{color:#ccc;background-color:transparent}\n.navbar-default .navbar-toggle{border-color:#ddd}\n.navbar-default .navbar-toggle:hover,.navbar-default .navbar-toggle:focus{background-color:#ddd}\n.navbar-default .navbar-toggle .icon-bar{background-color:#888}\n.navbar-default .navbar-collapse,.navbar-default .navbar-form{border-color:#e7e7e7}\n.navbar-default .navbar-nav>.open>a,.navbar-default .navbar-nav>.open>a:hover,.navbar-default .navbar-nav>.open>a:focus{background-color:#e7e7e7;color:#555}\n@media (max-width:767px){.navbar-default .navbar-nav .open .dropdown-menu>li>a{color:#777}.navbar-default .navbar-nav .open .dropdown-menu>li>a:hover,.navbar-default .navbar-nav .open .dropdown-menu>li>a:focus{color:#333;background-color:transparent}.navbar-default .navbar-nav .open .dropdown-menu>.active>a,.navbar-default .navbar-nav .open .dropdown-menu>.active>a:hover,.navbar-default .navbar-nav .open .dropdown-menu>.active>a:focus{color:#555;background-color:#e7e7e7}.navbar-default .navbar-nav .open .dropdown-menu>.disabled>a,.navbar-default .navbar-nav .open .dropdown-menu>.disabled>a:hover,.navbar-default .navbar-nav .open .dropdown-menu>.disabled>a:focus{color:#ccc;background-color:transparent}}\n.navbar-default .navbar-link{color:#777}\n.navbar-default .navbar-link:hover{color:#333}\n.navbar-default .btn-link{color:#777}\n.navbar-default .btn-link:hover,.navbar-default .btn-link:focus{color:#333}\n.navbar-default .btn-link[disabled]:hover,fieldset[disabled] .navbar-default .btn-link:hover,.navbar-default .btn-link[disabled]:focus,fieldset[disabled] .navbar-default .btn-link:focus{color:#ccc}\n.navbar-inverse{background-color:#222;border-color:#080808}\n.navbar-inverse .navbar-brand{color:#9d9d9d}\n.navbar-inverse .navbar-brand:hover,.navbar-inverse .navbar-brand:focus{color:#fff;background-color:transparent}\n.navbar-inverse .navbar-text{color:#9d9d9d}\n.navbar-inverse .navbar-nav>li>a{color:#9d9d9d}\n.navbar-inverse .navbar-nav>li>a:hover,.navbar-inverse .navbar-nav>li>a:focus{color:#fff;background-color:transparent}\n.navbar-inverse .navbar-nav>.active>a,.navbar-inverse .navbar-nav>.active>a:hover,.navbar-inverse .navbar-nav>.active>a:focus{color:#fff;background-color:#080808}\n.navbar-inverse .navbar-nav>.disabled>a,.navbar-inverse .navbar-nav>.disabled>a:hover,.navbar-inverse .navbar-nav>.disabled>a:focus{color:#444;background-color:transparent}\n.navbar-inverse .navbar-toggle{border-color:#333}\n.navbar-inverse .navbar-toggle:hover,.navbar-inverse .navbar-toggle:focus{background-color:#333}\n.navbar-inverse .navbar-toggle .icon-bar{background-color:#fff}\n.navbar-inverse .navbar-collapse,.navbar-inverse .navbar-form{border-color:#101010}\n.navbar-inverse .navbar-nav>.open>a,.navbar-inverse .navbar-nav>.open>a:hover,.navbar-inverse .navbar-nav>.open>a:focus{background-color:#080808;color:#fff}\n@media (max-width:767px){.navbar-inverse .navbar-nav .open .dropdown-menu>.dropdown-header{border-color:#080808}.navbar-inverse .navbar-nav .open .dropdown-menu .divider{background-color:#080808}.navbar-inverse .navbar-nav .open .dropdown-menu>li>a{color:#9d9d9d}.navbar-inverse .navbar-nav .open .dropdown-menu>li>a:hover,.navbar-inverse .navbar-nav .open .dropdown-menu>li>a:focus{color:#fff;background-color:transparent}.navbar-inverse .navbar-nav .open .dropdown-menu>.active>a,.navbar-inverse .navbar-nav .open .dropdown-menu>.active>a:hover,.navbar-inverse .navbar-nav .open .dropdown-menu>.active>a:focus{color:#fff;background-color:#080808}.navbar-inverse .navbar-nav .open .dropdown-menu>.disabled>a,.navbar-inverse .navbar-nav .open .dropdown-menu>.disabled>a:hover,.navbar-inverse .navbar-nav .open .dropdown-menu>.disabled>a:focus{color:#444;background-color:transparent}}\n.navbar-inverse .navbar-link{color:#9d9d9d}\n.navbar-inverse .navbar-link:hover{color:#fff}\n.navbar-inverse .btn-link{color:#9d9d9d}\n.navbar-inverse .btn-link:hover,.navbar-inverse .btn-link:focus{color:#fff}\n.navbar-inverse .btn-link[disabled]:hover,fieldset[disabled] .navbar-inverse .btn-link:hover,.navbar-inverse .btn-link[disabled]:focus,fieldset[disabled] .navbar-inverse .btn-link:focus{color:#444}\n.breadcrumb{padding:8px 15px;margin-bottom:20px;list-style:none;background-color:#f5f5f5;border-radius:4px}\n.breadcrumb>li{display:inline-block}\n.breadcrumb>li+li:before{content:\"/\\A0\";padding:0 5px;color:#ccc}\n.breadcrumb>.active{color:#777}\n.pagination{display:inline-block;padding-left:0;margin:20px 0;border-radius:4px}\n.pagination>li{display:inline}\n.pagination>li>a,.pagination>li>span{position:relative;float:left;padding:6px 12px;line-height:1.42857143;text-decoration:none;color:#337ab7;background-color:#fff;border:1px solid #ddd;margin-left:-1px}\n.pagination>li:first-child>a,.pagination>li:first-child>span{margin-left:0;border-bottom-left-radius:4px;border-top-left-radius:4px}\n.pagination>li:last-child>a,.pagination>li:last-child>span{border-bottom-right-radius:4px;border-top-right-radius:4px}\n.pagination>li>a:hover,.pagination>li>span:hover,.pagination>li>a:focus,.pagination>li>span:focus{z-index:2;color:#23527c;background-color:#eee;border-color:#ddd}\n.pagination>.active>a,.pagination>.active>span,.pagination>.active>a:hover,.pagination>.active>span:hover,.pagination>.active>a:focus,.pagination>.active>span:focus{z-index:3;color:#fff;background-color:#337ab7;border-color:#337ab7;cursor:default}\n.pagination>.disabled>span,.pagination>.disabled>span:hover,.pagination>.disabled>span:focus,.pagination>.disabled>a,.pagination>.disabled>a:hover,.pagination>.disabled>a:focus{color:#777;background-color:#fff;border-color:#ddd;cursor:not-allowed}\n.pagination-lg>li>a,.pagination-lg>li>span{padding:10px 16px;font-size:18px;line-height:1.3333333}\n.pagination-lg>li:first-child>a,.pagination-lg>li:first-child>span{border-bottom-left-radius:6px;border-top-left-radius:6px}\n.pagination-lg>li:last-child>a,.pagination-lg>li:last-child>span{border-bottom-right-radius:6px;border-top-right-radius:6px}\n.pagination-sm>li>a,.pagination-sm>li>span{padding:5px 10px;font-size:12px;line-height:1.5}\n.pagination-sm>li:first-child>a,.pagination-sm>li:first-child>span{border-bottom-left-radius:3px;border-top-left-radius:3px}\n.pagination-sm>li:last-child>a,.pagination-sm>li:last-child>span{border-bottom-right-radius:3px;border-top-right-radius:3px}\n.pager{padding-left:0;margin:20px 0;list-style:none;text-align:center}\n.pager li{display:inline}\n.pager li>a,.pager li>span{display:inline-block;padding:5px 14px;background-color:#fff;border:1px solid #ddd;border-radius:15px}\n.pager li>a:hover,.pager li>a:focus{text-decoration:none;background-color:#eee}\n.pager .next>a,.pager .next>span{float:right}\n.pager .previous>a,.pager .previous>span{float:left}\n.pager .disabled>a,.pager .disabled>a:hover,.pager .disabled>a:focus,.pager .disabled>span{color:#777;background-color:#fff;cursor:not-allowed}\n.label{display:inline;padding:.2em .6em .3em;font-size:75%;font-weight:bold;line-height:1;color:#fff;text-align:center;white-space:nowrap;vertical-align:baseline;border-radius:.25em}\na.label:hover,a.label:focus{color:#fff;text-decoration:none;cursor:pointer}\n.label:empty{display:none}\n.btn .label{position:relative;top:-1px}\n.label-default{background-color:#777}\n.label-default[href]:hover,.label-default[href]:focus{background-color:#5e5e5e}\n.label-primary{background-color:#337ab7}\n.label-primary[href]:hover,.label-primary[href]:focus{background-color:#286090}\n.label-success{background-color:#5cb85c}\n.label-success[href]:hover,.label-success[href]:focus{background-color:#449d44}\n.label-info{background-color:#5bc0de}\n.label-info[href]:hover,.label-info[href]:focus{background-color:#31b0d5}\n.label-warning{background-color:#f0ad4e}\n.label-warning[href]:hover,.label-warning[href]:focus{background-color:#ec971f}\n.label-danger{background-color:#d9534f}\n.label-danger[href]:hover,.label-danger[href]:focus{background-color:#c9302c}\n.badge{display:inline-block;min-width:10px;padding:3px 7px;font-size:12px;font-weight:bold;color:#fff;line-height:1;vertical-align:middle;white-space:nowrap;text-align:center;background-color:#777;border-radius:10px}\n.badge:empty{display:none}\n.btn .badge{position:relative;top:-1px}\n.btn-xs .badge,.btn-group-xs>.btn .badge{top:0;padding:1px 5px}\na.badge:hover,a.badge:focus{color:#fff;text-decoration:none;cursor:pointer}\n.list-group-item.active>.badge,.nav-pills>.active>a>.badge{color:#337ab7;background-color:#fff}\n.list-group-item>.badge{float:right}\n.list-group-item>.badge+.badge{margin-right:5px}\n.nav-pills>li>a>.badge{margin-left:3px}\n.jumbotron{padding-top:30px;padding-bottom:30px;margin-bottom:30px;color:inherit;background-color:#eee}\n.jumbotron h1,.jumbotron .h1{color:inherit}\n.jumbotron p{margin-bottom:15px;font-size:21px;font-weight:200}\n.jumbotron>hr{border-top-color:#d5d5d5}\n.container .jumbotron,.container-fluid .jumbotron{border-radius:6px;padding-left:15px;padding-right:15px}\n.jumbotron .container{max-width:100%}\n@media screen and (min-width:768px){.jumbotron{padding-top:48px;padding-bottom:48px}.container .jumbotron,.container-fluid .jumbotron{padding-left:60px;padding-right:60px}.jumbotron h1,.jumbotron .h1{font-size:63px}}\n.thumbnail{display:block;padding:4px;margin-bottom:20px;line-height:1.42857143;background-color:#fff;border:1px solid #ddd;border-radius:4px;-webkit-transition:border .2s ease-in-out;transition:border .2s ease-in-out}\n.thumbnail>img,.thumbnail a>img{margin-left:auto;margin-right:auto}\na.thumbnail:hover,a.thumbnail:focus,a.thumbnail.active{border-color:#337ab7}\n.thumbnail .caption{padding:9px;color:#333}\n.alert{padding:15px;margin-bottom:20px;border:1px solid transparent;border-radius:4px}\n.alert h4{margin-top:0;color:inherit}\n.alert .alert-link{font-weight:bold}\n.alert>p,.alert>ul{margin-bottom:0}\n.alert>p+p{margin-top:5px}\n.alert-dismissable,.alert-dismissible{padding-right:35px}\n.alert-dismissable .close,.alert-dismissible .close{position:relative;top:-2px;right:-21px;color:inherit}\n.alert-success{background-color:#dff0d8;border-color:#d6e9c6;color:#3c763d}\n.alert-success hr{border-top-color:#c9e2b3}\n.alert-success .alert-link{color:#2b542c}\n.alert-info{background-color:#d9edf7;border-color:#bce8f1;color:#31708f}\n.alert-info hr{border-top-color:#a6e1ec}\n.alert-info .alert-link{color:#245269}\n.alert-warning{background-color:#fcf8e3;border-color:#faebcc;color:#8a6d3b}\n.alert-warning hr{border-top-color:#f7e1b5}\n.alert-warning .alert-link{color:#66512c}\n.alert-danger{background-color:#f2dede;border-color:#ebccd1;color:#a94442}\n.alert-danger hr{border-top-color:#e4b9c0}\n.alert-danger .alert-link{color:#843534}\n@-webkit-keyframes progress-bar-stripes{from{background-position:40px 0}to{background-position:0 0}}\n@keyframes progress-bar-stripes{from{background-position:40px 0}to{background-position:0 0}}\n.progress{overflow:hidden;height:20px;margin-bottom:20px;background-color:#f5f5f5;border-radius:4px;-webkit-box-shadow:inset 0 1px 2px rgba(0, 0, 0, .1);box-shadow:inset 0 1px 2px rgba(0, 0, 0, .1)}\n.progress-bar{float:left;width:0%;height:100%;font-size:12px;line-height:20px;color:#fff;text-align:center;background-color:#337ab7;-webkit-box-shadow:inset 0 -1px 0 rgba(0, 0, 0, .15);box-shadow:inset 0 -1px 0 rgba(0, 0, 0, .15);-webkit-transition:width .6s ease;transition:width .6s ease}\n.progress-striped .progress-bar,.progress-bar-striped{background-image:linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);background-size:40px 40px}\n.progress.active .progress-bar,.progress-bar.active{-webkit-animation:progress-bar-stripes 2s linear infinite;animation:progress-bar-stripes 2s linear infinite}\n.progress-bar-success{background-color:#5cb85c}\n.progress-striped .progress-bar-success{background-image:linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent)}\n.progress-bar-info{background-color:#5bc0de}\n.progress-striped .progress-bar-info{background-image:linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent)}\n.progress-bar-warning{background-color:#f0ad4e}\n.progress-striped .progress-bar-warning{background-image:linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent)}\n.progress-bar-danger{background-color:#d9534f}\n.progress-striped .progress-bar-danger{background-image:linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent)}\n.media{margin-top:15px}\n.media:first-child{margin-top:0}\n.media,.media-body{zoom:1;overflow:hidden}\n.media-body{width:10000px}\n.media-object{display:block}\n.media-object.img-thumbnail{max-width:none}\n.media-right,.media>.pull-right{padding-left:10px}\n.media-left,.media>.pull-left{padding-right:10px}\n.media-left,.media-right,.media-body{display:table-cell;vertical-align:top}\n.media-middle{vertical-align:middle}\n.media-bottom{vertical-align:bottom}\n.media-heading{margin-top:0;margin-bottom:5px}\n.media-list{padding-left:0;list-style:none}\n.list-group{margin-bottom:20px;padding-left:0}\n.list-group-item{position:relative;display:block;padding:10px 15px;margin-bottom:-1px;background-color:#fff;border:1px solid #ddd}\n.list-group-item:first-child{border-top-right-radius:4px;border-top-left-radius:4px}\n.list-group-item:last-child{margin-bottom:0;border-bottom-right-radius:4px;border-bottom-left-radius:4px}\na.list-group-item,button.list-group-item{color:#555}\na.list-group-item .list-group-item-heading,button.list-group-item .list-group-item-heading{color:#333}\na.list-group-item:hover,button.list-group-item:hover,a.list-group-item:focus,button.list-group-item:focus{text-decoration:none;color:#555;background-color:#f5f5f5}\nbutton.list-group-item{width:100%;text-align:left}\n.list-group-item.disabled,.list-group-item.disabled:hover,.list-group-item.disabled:focus{background-color:#eee;color:#777;cursor:not-allowed}\n.list-group-item.disabled .list-group-item-heading,.list-group-item.disabled:hover .list-group-item-heading,.list-group-item.disabled:focus .list-group-item-heading{color:inherit}\n.list-group-item.disabled .list-group-item-text,.list-group-item.disabled:hover .list-group-item-text,.list-group-item.disabled:focus .list-group-item-text{color:#777}\n.list-group-item.active,.list-group-item.active:hover,.list-group-item.active:focus{z-index:2;color:#fff;background-color:#337ab7;border-color:#337ab7}\n.list-group-item.active .list-group-item-heading,.list-group-item.active:hover .list-group-item-heading,.list-group-item.active:focus .list-group-item-heading,.list-group-item.active .list-group-item-heading>small,.list-group-item.active:hover .list-group-item-heading>small,.list-group-item.active:focus .list-group-item-heading>small,.list-group-item.active .list-group-item-heading>.small,.list-group-item.active:hover .list-group-item-heading>.small,.list-group-item.active:focus .list-group-item-heading>.small{color:inherit}\n.list-group-item.active .list-group-item-text,.list-group-item.active:hover .list-group-item-text,.list-group-item.active:focus .list-group-item-text{color:#c7ddef}\n.list-group-item-success{color:#3c763d;background-color:#dff0d8}\na.list-group-item-success,button.list-group-item-success{color:#3c763d}\na.list-group-item-success .list-group-item-heading,button.list-group-item-success .list-group-item-heading{color:inherit}\na.list-group-item-success:hover,button.list-group-item-success:hover,a.list-group-item-success:focus,button.list-group-item-success:focus{color:#3c763d;background-color:#d0e9c6}\na.list-group-item-success.active,button.list-group-item-success.active,a.list-group-item-success.active:hover,button.list-group-item-success.active:hover,a.list-group-item-success.active:focus,button.list-group-item-success.active:focus{color:#fff;background-color:#3c763d;border-color:#3c763d}\n.list-group-item-info{color:#31708f;background-color:#d9edf7}\na.list-group-item-info,button.list-group-item-info{color:#31708f}\na.list-group-item-info .list-group-item-heading,button.list-group-item-info .list-group-item-heading{color:inherit}\na.list-group-item-info:hover,button.list-group-item-info:hover,a.list-group-item-info:focus,button.list-group-item-info:focus{color:#31708f;background-color:#c4e3f3}\na.list-group-item-info.active,button.list-group-item-info.active,a.list-group-item-info.active:hover,button.list-group-item-info.active:hover,a.list-group-item-info.active:focus,button.list-group-item-info.active:focus{color:#fff;background-color:#31708f;border-color:#31708f}\n.list-group-item-warning{color:#8a6d3b;background-color:#fcf8e3}\na.list-group-item-warning,button.list-group-item-warning{color:#8a6d3b}\na.list-group-item-warning .list-group-item-heading,button.list-group-item-warning .list-group-item-heading{color:inherit}\na.list-group-item-warning:hover,button.list-group-item-warning:hover,a.list-group-item-warning:focus,button.list-group-item-warning:focus{color:#8a6d3b;background-color:#faf2cc}\na.list-group-item-warning.active,button.list-group-item-warning.active,a.list-group-item-warning.active:hover,button.list-group-item-warning.active:hover,a.list-group-item-warning.active:focus,button.list-group-item-warning.active:focus{color:#fff;background-color:#8a6d3b;border-color:#8a6d3b}\n.list-group-item-danger{color:#a94442;background-color:#f2dede}\na.list-group-item-danger,button.list-group-item-danger{color:#a94442}\na.list-group-item-danger .list-group-item-heading,button.list-group-item-danger .list-group-item-heading{color:inherit}\na.list-group-item-danger:hover,button.list-group-item-danger:hover,a.list-group-item-danger:focus,button.list-group-item-danger:focus{color:#a94442;background-color:#ebcccc}\na.list-group-item-danger.active,button.list-group-item-danger.active,a.list-group-item-danger.active:hover,button.list-group-item-danger.active:hover,a.list-group-item-danger.active:focus,button.list-group-item-danger.active:focus{color:#fff;background-color:#a94442;border-color:#a94442}\n.list-group-item-heading{margin-top:0;margin-bottom:5px}\n.list-group-item-text{margin-bottom:0;line-height:1.3}\n.panel{margin-bottom:20px;background-color:#fff;border:1px solid transparent;border-radius:4px;-webkit-box-shadow:0 1px 1px rgba(0, 0, 0, .05);box-shadow:0 1px 1px rgba(0, 0, 0, .05)}\n.panel-body{padding:15px}\n.panel-heading{padding:10px 15px;border-bottom:1px solid transparent;border-top-right-radius:3px;border-top-left-radius:3px}\n.panel-heading>.dropdown .dropdown-toggle{color:inherit}\n.panel-title{margin-top:0;margin-bottom:0;font-size:16px;color:inherit}\n.panel-title>a,.panel-title>small,.panel-title>.small,.panel-title>small>a,.panel-title>.small>a{color:inherit}\n.panel-footer{padding:10px 15px;background-color:#f5f5f5;border-top:1px solid #ddd;border-bottom-right-radius:3px;border-bottom-left-radius:3px}\n.panel>.list-group,.panel>.panel-collapse>.list-group{margin-bottom:0}\n.panel>.list-group .list-group-item,.panel>.panel-collapse>.list-group .list-group-item{border-width:1px 0;border-radius:0}\n.panel>.list-group:first-child .list-group-item:first-child,.panel>.panel-collapse>.list-group:first-child .list-group-item:first-child{border-top:0;border-top-right-radius:3px;border-top-left-radius:3px}\n.panel>.list-group:last-child .list-group-item:last-child,.panel>.panel-collapse>.list-group:last-child .list-group-item:last-child{border-bottom:0;border-bottom-right-radius:3px;border-bottom-left-radius:3px}\n.panel>.panel-heading+.panel-collapse>.list-group .list-group-item:first-child{border-top-right-radius:0;border-top-left-radius:0}\n.panel-heading+.list-group .list-group-item:first-child{border-top-width:0}\n.list-group+.panel-footer{border-top-width:0}\n.panel>.table,.panel>.table-responsive>.table,.panel>.panel-collapse>.table{margin-bottom:0}\n.panel>.table caption,.panel>.table-responsive>.table caption,.panel>.panel-collapse>.table caption{padding-left:15px;padding-right:15px}\n.panel>.table:first-child,.panel>.table-responsive:first-child>.table:first-child{border-top-right-radius:3px;border-top-left-radius:3px}\n.panel>.table:first-child>thead:first-child>tr:first-child,.panel>.table-responsive:first-child>.table:first-child>thead:first-child>tr:first-child,.panel>.table:first-child>tbody:first-child>tr:first-child,.panel>.table-responsive:first-child>.table:first-child>tbody:first-child>tr:first-child{border-top-left-radius:3px;border-top-right-radius:3px}\n.panel>.table:first-child>thead:first-child>tr:first-child td:first-child,.panel>.table-responsive:first-child>.table:first-child>thead:first-child>tr:first-child td:first-child,.panel>.table:first-child>tbody:first-child>tr:first-child td:first-child,.panel>.table-responsive:first-child>.table:first-child>tbody:first-child>tr:first-child td:first-child,.panel>.table:first-child>thead:first-child>tr:first-child th:first-child,.panel>.table-responsive:first-child>.table:first-child>thead:first-child>tr:first-child th:first-child,.panel>.table:first-child>tbody:first-child>tr:first-child th:first-child,.panel>.table-responsive:first-child>.table:first-child>tbody:first-child>tr:first-child th:first-child{border-top-left-radius:3px}\n.panel>.table:first-child>thead:first-child>tr:first-child td:last-child,.panel>.table-responsive:first-child>.table:first-child>thead:first-child>tr:first-child td:last-child,.panel>.table:first-child>tbody:first-child>tr:first-child td:last-child,.panel>.table-responsive:first-child>.table:first-child>tbody:first-child>tr:first-child td:last-child,.panel>.table:first-child>thead:first-child>tr:first-child th:last-child,.panel>.table-responsive:first-child>.table:first-child>thead:first-child>tr:first-child th:last-child,.panel>.table:first-child>tbody:first-child>tr:first-child th:last-child,.panel>.table-responsive:first-child>.table:first-child>tbody:first-child>tr:first-child th:last-child{border-top-right-radius:3px}\n.panel>.table:last-child,.panel>.table-responsive:last-child>.table:last-child{border-bottom-right-radius:3px;border-bottom-left-radius:3px}\n.panel>.table:last-child>tbody:last-child>tr:last-child,.panel>.table-responsive:last-child>.table:last-child>tbody:last-child>tr:last-child,.panel>.table:last-child>tfoot:last-child>tr:last-child,.panel>.table-responsive:last-child>.table:last-child>tfoot:last-child>tr:last-child{border-bottom-left-radius:3px;border-bottom-right-radius:3px}\n.panel>.table:last-child>tbody:last-child>tr:last-child td:first-child,.panel>.table-responsive:last-child>.table:last-child>tbody:last-child>tr:last-child td:first-child,.panel>.table:last-child>tfoot:last-child>tr:last-child td:first-child,.panel>.table-responsive:last-child>.table:last-child>tfoot:last-child>tr:last-child td:first-child,.panel>.table:last-child>tbody:last-child>tr:last-child th:first-child,.panel>.table-responsive:last-child>.table:last-child>tbody:last-child>tr:last-child th:first-child,.panel>.table:last-child>tfoot:last-child>tr:last-child th:first-child,.panel>.table-responsive:last-child>.table:last-child>tfoot:last-child>tr:last-child th:first-child{border-bottom-left-radius:3px}\n.panel>.table:last-child>tbody:last-child>tr:last-child td:last-child,.panel>.table-responsive:last-child>.table:last-child>tbody:last-child>tr:last-child td:last-child,.panel>.table:last-child>tfoot:last-child>tr:last-child td:last-child,.panel>.table-responsive:last-child>.table:last-child>tfoot:last-child>tr:last-child td:last-child,.panel>.table:last-child>tbody:last-child>tr:last-child th:last-child,.panel>.table-responsive:last-child>.table:last-child>tbody:last-child>tr:last-child th:last-child,.panel>.table:last-child>tfoot:last-child>tr:last-child th:last-child,.panel>.table-responsive:last-child>.table:last-child>tfoot:last-child>tr:last-child th:last-child{border-bottom-right-radius:3px}\n.panel>.panel-body+.table,.panel>.panel-body+.table-responsive,.panel>.table+.panel-body,.panel>.table-responsive+.panel-body{border-top:1px solid #ddd}\n.panel>.table>tbody:first-child>tr:first-child th,.panel>.table>tbody:first-child>tr:first-child td{border-top:0}\n.panel>.table-bordered,.panel>.table-responsive>.table-bordered{border:0}\n.panel>.table-bordered>thead>tr>th:first-child,.panel>.table-responsive>.table-bordered>thead>tr>th:first-child,.panel>.table-bordered>tbody>tr>th:first-child,.panel>.table-responsive>.table-bordered>tbody>tr>th:first-child,.panel>.table-bordered>tfoot>tr>th:first-child,.panel>.table-responsive>.table-bordered>tfoot>tr>th:first-child,.panel>.table-bordered>thead>tr>td:first-child,.panel>.table-responsive>.table-bordered>thead>tr>td:first-child,.panel>.table-bordered>tbody>tr>td:first-child,.panel>.table-responsive>.table-bordered>tbody>tr>td:first-child,.panel>.table-bordered>tfoot>tr>td:first-child,.panel>.table-responsive>.table-bordered>tfoot>tr>td:first-child{border-left:0}\n.panel>.table-bordered>thead>tr>th:last-child,.panel>.table-responsive>.table-bordered>thead>tr>th:last-child,.panel>.table-bordered>tbody>tr>th:last-child,.panel>.table-responsive>.table-bordered>tbody>tr>th:last-child,.panel>.table-bordered>tfoot>tr>th:last-child,.panel>.table-responsive>.table-bordered>tfoot>tr>th:last-child,.panel>.table-bordered>thead>tr>td:last-child,.panel>.table-responsive>.table-bordered>thead>tr>td:last-child,.panel>.table-bordered>tbody>tr>td:last-child,.panel>.table-responsive>.table-bordered>tbody>tr>td:last-child,.panel>.table-bordered>tfoot>tr>td:last-child,.panel>.table-responsive>.table-bordered>tfoot>tr>td:last-child{border-right:0}\n.panel>.table-bordered>thead>tr:first-child>td,.panel>.table-responsive>.table-bordered>thead>tr:first-child>td,.panel>.table-bordered>tbody>tr:first-child>td,.panel>.table-responsive>.table-bordered>tbody>tr:first-child>td,.panel>.table-bordered>thead>tr:first-child>th,.panel>.table-responsive>.table-bordered>thead>tr:first-child>th,.panel>.table-bordered>tbody>tr:first-child>th,.panel>.table-responsive>.table-bordered>tbody>tr:first-child>th{border-bottom:0}\n.panel>.table-bordered>tbody>tr:last-child>td,.panel>.table-responsive>.table-bordered>tbody>tr:last-child>td,.panel>.table-bordered>tfoot>tr:last-child>td,.panel>.table-responsive>.table-bordered>tfoot>tr:last-child>td,.panel>.table-bordered>tbody>tr:last-child>th,.panel>.table-responsive>.table-bordered>tbody>tr:last-child>th,.panel>.table-bordered>tfoot>tr:last-child>th,.panel>.table-responsive>.table-bordered>tfoot>tr:last-child>th{border-bottom:0}\n.panel>.table-responsive{border:0;margin-bottom:0}\n.panel-group{margin-bottom:20px}\n.panel-group .panel{margin-bottom:0;border-radius:4px}\n.panel-group .panel+.panel{margin-top:5px}\n.panel-group .panel-heading{border-bottom:0}\n.panel-group .panel-heading+.panel-collapse>.panel-body,.panel-group .panel-heading+.panel-collapse>.list-group{border-top:1px solid #ddd}\n.panel-group .panel-footer{border-top:0}\n.panel-group .panel-footer+.panel-collapse .panel-body{border-bottom:1px solid #ddd}\n.panel-default{border-color:#ddd}\n.panel-default>.panel-heading{color:#333;background-color:#f5f5f5;border-color:#ddd}\n.panel-default>.panel-heading+.panel-collapse>.panel-body{border-top-color:#ddd}\n.panel-default>.panel-heading .badge{color:#f5f5f5;background-color:#333}\n.panel-default>.panel-footer+.panel-collapse>.panel-body{border-bottom-color:#ddd}\n.panel-primary{border-color:#337ab7}\n.panel-primary>.panel-heading{color:#fff;background-color:#337ab7;border-color:#337ab7}\n.panel-primary>.panel-heading+.panel-collapse>.panel-body{border-top-color:#337ab7}\n.panel-primary>.panel-heading .badge{color:#337ab7;background-color:#fff}\n.panel-primary>.panel-footer+.panel-collapse>.panel-body{border-bottom-color:#337ab7}\n.panel-success{border-color:#d6e9c6}\n.panel-success>.panel-heading{color:#3c763d;background-color:#dff0d8;border-color:#d6e9c6}\n.panel-success>.panel-heading+.panel-collapse>.panel-body{border-top-color:#d6e9c6}\n.panel-success>.panel-heading .badge{color:#dff0d8;background-color:#3c763d}\n.panel-success>.panel-footer+.panel-collapse>.panel-body{border-bottom-color:#d6e9c6}\n.panel-info{border-color:#bce8f1}\n.panel-info>.panel-heading{color:#31708f;background-color:#d9edf7;border-color:#bce8f1}\n.panel-info>.panel-heading+.panel-collapse>.panel-body{border-top-color:#bce8f1}\n.panel-info>.panel-heading .badge{color:#d9edf7;background-color:#31708f}\n.panel-info>.panel-footer+.panel-collapse>.panel-body{border-bottom-color:#bce8f1}\n.panel-warning{border-color:#faebcc}\n.panel-warning>.panel-heading{color:#8a6d3b;background-color:#fcf8e3;border-color:#faebcc}\n.panel-warning>.panel-heading+.panel-collapse>.panel-body{border-top-color:#faebcc}\n.panel-warning>.panel-heading .badge{color:#fcf8e3;background-color:#8a6d3b}\n.panel-warning>.panel-footer+.panel-collapse>.panel-body{border-bottom-color:#faebcc}\n.panel-danger{border-color:#ebccd1}\n.panel-danger>.panel-heading{color:#a94442;background-color:#f2dede;border-color:#ebccd1}\n.panel-danger>.panel-heading+.panel-collapse>.panel-body{border-top-color:#ebccd1}\n.panel-danger>.panel-heading .badge{color:#f2dede;background-color:#a94442}\n.panel-danger>.panel-footer+.panel-collapse>.panel-body{border-bottom-color:#ebccd1}\n.embed-responsive{position:relative;display:block;height:0;padding:0;overflow:hidden}\n.embed-responsive .embed-responsive-item,.embed-responsive iframe,.embed-responsive embed,.embed-responsive object,.embed-responsive video{position:absolute;top:0;left:0;bottom:0;height:100%;width:100%;border:0}\n.embed-responsive-16by9{padding-bottom:56.25%}\n.embed-responsive-4by3{padding-bottom:75%}\n.well{min-height:20px;padding:19px;margin-bottom:20px;background-color:#f5f5f5;border:1px solid #e3e3e3;border-radius:4px;-webkit-box-shadow:inset 0 1px 1px rgba(0, 0, 0, .05);box-shadow:inset 0 1px 1px rgba(0, 0, 0, .05)}\n.well blockquote{border-color:#ddd;border-color:rgba(0, 0, 0, .15)}\n.well-lg{padding:24px;border-radius:6px}\n.well-sm{padding:9px;border-radius:3px}\n.close{float:right;font-size:21px;font-weight:bold;line-height:1;color:#000;text-shadow:0 1px 0 #fff;opacity:.2;filter:alpha(opacity=20)}\n.close:hover,.close:focus{color:#000;text-decoration:none;cursor:pointer;opacity:.5;filter:alpha(opacity=50)}\nbutton.close{padding:0;cursor:pointer;background:transparent;border:0;-webkit-appearance:none}\n.modal-open{overflow:hidden}\n.modal{display:none;overflow:hidden;position:fixed;top:0;right:0;bottom:0;left:0;z-index:1050;-webkit-overflow-scrolling:touch;outline:0}\n.modal.fade .modal-dialog{-webkit-transform:translate(0, -25%);transform:translate(0, -25%);-webkit-transition:-webkit-transform 0.3s ease-out;transition:-webkit-transform 0.3s ease-out;transition:transform 0.3s ease-out;transition:transform 0.3s ease-out, -webkit-transform 0.3s ease-out}\n.modal.in .modal-dialog{-webkit-transform:translate(0, 0);transform:translate(0, 0)}\n.modal-open .modal{overflow-x:hidden;overflow-y:auto}\n.modal-dialog{position:relative;width:auto;margin:10px}\n.modal-content{position:relative;background-color:#fff;border:1px solid #999;border:1px solid rgba(0, 0, 0, .2);border-radius:6px;-webkit-box-shadow:0 3px 9px rgba(0, 0, 0, .5);box-shadow:0 3px 9px rgba(0, 0, 0, .5);background-clip:padding-box;outline:0}\n.modal-backdrop{position:fixed;top:0;right:0;bottom:0;left:0;z-index:1040;background-color:#000}\n.modal-backdrop.fade{opacity:0;filter:alpha(opacity=0)}\n.modal-backdrop.in{opacity:.5;filter:alpha(opacity=50)}\n.modal-header{padding:15px;border-bottom:1px solid #e5e5e5}\n.modal-header .close{margin-top:-2px}\n.modal-title{margin:0;line-height:1.42857143}\n.modal-body{position:relative;padding:15px}\n.modal-footer{padding:15px;text-align:right;border-top:1px solid #e5e5e5}\n.modal-footer .btn+.btn{margin-left:5px;margin-bottom:0}\n.modal-footer .btn-group .btn+.btn{margin-left:-1px}\n.modal-footer .btn-block+.btn-block{margin-left:0}\n.modal-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}\n@media (min-width:768px){.modal-dialog{width:600px;margin:30px auto}.modal-content{-webkit-box-shadow:0 5px 15px rgba(0, 0, 0, .5);box-shadow:0 5px 15px rgba(0, 0, 0, .5)}.modal-sm{width:300px}}\n@media (min-width:992px){.modal-lg{width:900px}}\n.clearfix:before,.clearfix:after,.dl-horizontal dd:before,.dl-horizontal dd:after,.container:before,.container:after,.container-fluid:before,.container-fluid:after,.row:before,.row:after,.form-horizontal .form-group:before,.form-horizontal .form-group:after,.btn-toolbar:before,.btn-toolbar:after,.btn-group-vertical>.btn-group:before,.btn-group-vertical>.btn-group:after,.nav:before,.nav:after,.navbar:before,.navbar:after,.navbar-header:before,.navbar-header:after,.navbar-collapse:before,.navbar-collapse:after,.pager:before,.pager:after,.panel-body:before,.panel-body:after,.modal-header:before,.modal-header:after,.modal-footer:before,.modal-footer:after{content:\" \";display:table}\n.clearfix:after,.dl-horizontal dd:after,.container:after,.container-fluid:after,.row:after,.form-horizontal .form-group:after,.btn-toolbar:after,.btn-group-vertical>.btn-group:after,.nav:after,.navbar:after,.navbar-header:after,.navbar-collapse:after,.pager:after,.panel-body:after,.modal-header:after,.modal-footer:after{clear:both}\n.center-block{display:block;margin-left:auto;margin-right:auto}\n.pull-right{float:right !important}\n.pull-left{float:left !important}\n.hide{display:none !important}\n.show{display:block !important}\n.invisible{visibility:hidden}\n.text-hide{font:0/0 a;color:transparent;text-shadow:none;background-color:transparent;border:0}\n.hidden{display:none !important}\n.affix{position:fixed}\n@-ms-viewport{width:device-width}\n.visible-xs,.visible-sm,.visible-md,.visible-lg{display:none !important}\n.visible-xs-block,.visible-xs-inline,.visible-xs-inline-block,.visible-sm-block,.visible-sm-inline,.visible-sm-inline-block,.visible-md-block,.visible-md-inline,.visible-md-inline-block,.visible-lg-block,.visible-lg-inline,.visible-lg-inline-block{display:none !important}\n@media (max-width:767px){.visible-xs{display:block !important}table.visible-xs{display:table !important}tr.visible-xs{display:table-row !important}th.visible-xs,td.visible-xs{display:table-cell !important}}\n@media (max-width:767px){.visible-xs-block{display:block !important}}\n@media (max-width:767px){.visible-xs-inline{display:inline !important}}\n@media (max-width:767px){.visible-xs-inline-block{display:inline-block !important}}\n@media (min-width:768px) and (max-width:991px){.visible-sm{display:block !important}table.visible-sm{display:table !important}tr.visible-sm{display:table-row !important}th.visible-sm,td.visible-sm{display:table-cell !important}}\n@media (min-width:768px) and (max-width:991px){.visible-sm-block{display:block !important}}\n@media (min-width:768px) and (max-width:991px){.visible-sm-inline{display:inline !important}}\n@media (min-width:768px) and (max-width:991px){.visible-sm-inline-block{display:inline-block !important}}\n@media (min-width:992px) and (max-width:1199px){.visible-md{display:block !important}table.visible-md{display:table !important}tr.visible-md{display:table-row !important}th.visible-md,td.visible-md{display:table-cell !important}}\n@media (min-width:992px) and (max-width:1199px){.visible-md-block{display:block !important}}\n@media (min-width:992px) and (max-width:1199px){.visible-md-inline{display:inline !important}}\n@media (min-width:992px) and (max-width:1199px){.visible-md-inline-block{display:inline-block !important}}\n@media (min-width:1200px){.visible-lg{display:block !important}table.visible-lg{display:table !important}tr.visible-lg{display:table-row !important}th.visible-lg,td.visible-lg{display:table-cell !important}}\n@media (min-width:1200px){.visible-lg-block{display:block !important}}\n@media (min-width:1200px){.visible-lg-inline{display:inline !important}}\n@media (min-width:1200px){.visible-lg-inline-block{display:inline-block !important}}\n@media (max-width:767px){.hidden-xs{display:none !important}}\n@media (min-width:768px) and (max-width:991px){.hidden-sm{display:none !important}}\n@media (min-width:992px) and (max-width:1199px){.hidden-md{display:none !important}}\n@media (min-width:1200px){.hidden-lg{display:none !important}}\n.visible-print{display:none !important}\n@media print{.visible-print{display:block !important}table.visible-print{display:table !important}tr.visible-print{display:table-row !important}th.visible-print,td.visible-print{display:table-cell !important}}\n.visible-print-block{display:none !important}\n@media print{.visible-print-block{display:block !important}}\n.visible-print-inline{display:none !important}\n@media print{.visible-print-inline{display:inline !important}}\n.visible-print-inline-block{display:none !important}\n@media print{.visible-print-inline-block{display:inline-block !important}}\n@media print{.hidden-print{display:none !important}}\n/*\n * Author - Sergei Troitskyi\n * https://wrapbootstrap.com/user/web-master72\n * v0.2\n*/\n.m-0 { margin: 0px !important; }\n.m-t-0 { margin-top: 0px !important; }\n.m-t-10 { margin-top: 10px !important; }\n.m-t-20 { margin-top: 20px !important; }\n.m-t-30 { margin-top: 30px !important; }\n.m-t-40 { margin-top: 40px !important; }\n.m-t-50 { margin-top: 50px !important; }\n.m-t-60 { margin-top: 60px !important; }\n.m-t-70 { margin-top: 70px !important; }\n.m-t-80 { margin-top: 80px !important; }\n.m-t-90 { margin-top: 90px !important; }\n.m-t-100 { margin-top: 100px !important; }\n.m-t-110 { margin-top: 110px !important; }\n.m-t-120 { margin-top: 120px !important; }\n.m-t-130 { margin-top: 130px !important; }\n.m-t-140 { margin-top: 140px !important; }\n.m-b-0 { margin-bottom: 0px !important; }\n.m-b-10 { margin-bottom: 10px !important; }\n.m-b-20 { margin-bottom: 20px !important; }\n.m-b-30 { margin-bottom: 30px !important; }\n.m-b-40 { margin-bottom: 40px !important; }\n.m-b-50 { margin-bottom: 50px !important; }\n.m-b-60 { margin-bottom: 60px !important; }\n.m-b-70 { margin-bottom: 70px !important; }\n.m-b-80 { margin-bottom: 80px !important; }\n.m-b-90 { margin-bottom: 90px !important; }\n.m-b-100 { margin-bottom: 100px !important; }\n.m-b-110 { margin-bottom: 110px !important; }\n.m-b-120 { margin-bottom: 120px !important; }\n.m-b-130 { margin-bottom: 130px !important; }\n.m-b-140 { margin-bottom: 140px !important; }\n.p-0 { padding: 0px !important; }\n.p-t-0 { padding-top: 0px !important; }\n.p-t-10 { padding-top: 10px !important; }\n.p-t-20 { padding-top: 20px !important; }\n.p-t-30 { padding-top: 30px !important; }\n.p-t-40 { padding-top: 40px !important; }\n.p-t-50 { padding-top: 50px !important; }\n.p-t-60 { padding-top: 60px !important; }\n.p-t-70 { padding-top: 70px !important; }\n.p-t-80 { padding-top: 80px !important; }\n.p-t-90 { padding-top: 90px !important; }\n.p-t-100 { padding-top: 100px !important; }\n.p-t-110 { padding-top: 110px !important; }\n.p-t-120 { padding-top: 120px !important; }\n.p-t-130 { padding-top: 130px !important; }\n.p-t-140 { padding-top: 140px !important; }\n.p-b-0 { padding-bottom: 0px !important; }\n.p-b-10 { padding-bottom: 10px !important; }\n.p-b-20 { padding-bottom: 20px !important; }\n.p-b-30 { padding-bottom: 30px !important; }\n.p-b-40 { padding-bottom: 40px !important; }\n.p-b-50 { padding-bottom: 50px !important; }\n.p-b-60 { padding-bottom: 60px !important; }\n.p-b-70 { padding-bottom: 70px !important; }\n.p-b-80 { padding-bottom: 80px !important; }\n.p-b-90 { padding-bottom: 90px !important; }\n.p-b-100 { padding-bottom: 100px !important; }\n.p-b-110 { padding-bottom: 110px !important; }\n.p-b-120 { padding-bottom: 120px !important; }\n.p-b-130 { padding-bottom: 130px !important; }\n.p-b-140 { padding-bottom: 140px !important; }\n@media only screen and (max-width: 991px) {\n\n\t.m-t-md-0 { margin-top: 0px !important; }\n\t.m-t-md-10 { margin-top: 10px !important; }\n\t.m-t-md-20 { margin-top: 20px !important; }\n\t.m-t-md-30 { margin-top: 30px !important; }\n\t.m-t-md-40 { margin-top: 40px !important; }\n\t.m-t-md-50 { margin-top: 50px !important; }\n\t.m-t-md-60 { margin-top: 60px !important; }\n\t.m-t-md-70 { margin-top: 70px !important; }\n\t.m-t-md-80 { margin-top: 80px !important; }\n\t.m-t-md-90 { margin-top: 90px !important; }\n\t.m-t-md-100 { margin-top: 100px !important; }\n\t.m-t-md-110 { margin-top: 110px !important; }\n\t.m-t-md-120 { margin-top: 120px !important; }\n\t.m-t-md-130 { margin-top: 130px !important; }\n\t.m-t-md-140 { margin-top: 140px !important; }\n\n\t.m-b-md-0 { margin-bottom: 0px !important; }\n\t.m-b-md-10 { margin-bottom: 10px !important; }\n\t.m-b-md-20 { margin-bottom: 20px !important; }\n\t.m-b-md-30 { margin-bottom: 30px !important; }\n\t.m-b-md-40 { margin-bottom: 40px !important; }\n\t.m-b-md-50 { margin-bottom: 50px !important; }\n\t.m-b-md-60 { margin-bottom: 60px !important; }\n\t.m-b-md-70 { margin-bottom: 70px !important; }\n\t.m-b-md-80 { margin-bottom: 80px !important; }\n\t.m-b-md-90 { margin-bottom: 90px !important; }\n\t.m-b-md-100 { margin-bottom: 100px !important; }\n\t.m-b-md-110 { margin-bottom: 110px !important; }\n\t.m-b-md-120 { margin-bottom: 120px !important; }\n\t.m-b-md-130 { margin-bottom: 130px !important; }\n\t.m-b-md-140 { margin-bottom: 140px !important; }\n\n\t.p-t-md-0 { padding-top: 0px !important; }\n\t.p-t-md-10 { padding-top: 10px !important; }\n\t.p-t-md-20 { padding-top: 20px !important; }\n\t.p-t-md-30 { padding-top: 30px !important; }\n\t.p-t-md-40 { padding-top: 40px !important; }\n\t.p-t-md-50 { padding-top: 50px !important; }\n\t.p-t-md-60 { padding-top: 60px !important; }\n\t.p-t-md-70 { padding-top: 70px !important; }\n\t.p-t-md-80 { padding-top: 80px !important; }\n\t.p-t-md-90 { padding-top: 90px !important; }\n\t.p-t-md-100 { padding-top: 100px !important; }\n\t.p-t-md-110 { padding-top: 110px !important; }\n\t.p-t-md-120 { padding-top: 120px !important; }\n\t.p-t-md-130 { padding-top: 130px !important; }\n\t.p-t-md-140 { padding-top: 140px !important; }\n\n\t.p-b-md-0 { padding-bottom: 0px !important; }\n\t.p-b-md-10 { padding-bottom: 10px !important; }\n\t.p-b-md-20 { padding-bottom: 20px !important; }\n\t.p-b-md-30 { padding-bottom: 30px !important; }\n\t.p-b-md-40 { padding-bottom: 40px !important; }\n\t.p-b-md-50 { padding-bottom: 50px !important; }\n\t.p-b-md-60 { padding-bottom: 60px !important; }\n\t.p-b-md-70 { padding-bottom: 70px !important; }\n\t.p-b-md-80 { padding-bottom: 80px !important; }\n\t.p-b-md-90 { padding-bottom: 90px !important; }\n\t.p-b-md-100 { padding-bottom: 100px !important; }\n\t.p-b-md-110 { padding-bottom: 110px !important; }\n\t.p-b-md-120 { padding-bottom: 120px !important; }\n\t.p-b-md-130 { padding-bottom: 130px !important; }\n\t.p-b-md-140 { padding-bottom: 140px !important; }\n\n}\n@media (max-width: 767px) {\n\n\t.m-t-sm-0 { margin-top: 0px !important; }\n\t.m-t-sm-10 { margin-top: 10px !important; }\n\t.m-t-sm-20 { margin-top: 20px !important; }\n\t.m-t-sm-30 { margin-top: 30px !important; }\n\t.m-t-sm-40 { margin-top: 40px !important; }\n\t.m-t-sm-50 { margin-top: 50px !important; }\n\t.m-t-sm-60 { margin-top: 60px !important; }\n\t.m-t-sm-70 { margin-top: 70px !important; }\n\t.m-t-sm-80 { margin-top: 80px !important; }\n\t.m-t-sm-90 { margin-top: 90px !important; }\n\t.m-t-sm-100 { margin-top: 100px !important; }\n\t.m-t-sm-110 { margin-top: 110px !important; }\n\t.m-t-sm-120 { margin-top: 120px !important; }\n\t.m-t-sm-130 { margin-top: 130px !important; }\n\t.m-t-sm-140 { margin-top: 140px !important; }\n\n\t.m-b-sm-0 { margin-bottom: 0px !important; }\n\t.m-b-sm-10 { margin-bottom: 10px !important; }\n\t.m-b-sm-20 { margin-bottom: 20px !important; }\n\t.m-b-sm-30 { margin-bottom: 30px !important; }\n\t.m-b-sm-40 { margin-bottom: 40px !important; }\n\t.m-b-sm-50 { margin-bottom: 50px !important; }\n\t.m-b-sm-60 { margin-bottom: 60px !important; }\n\t.m-b-sm-70 { margin-bottom: 70px !important; }\n\t.m-b-sm-80 { margin-bottom: 80px !important; }\n\t.m-b-sm-90 { margin-bottom: 90px !important; }\n\t.m-b-sm-100 { margin-bottom: 100px !important; }\n\t.m-b-sm-110 { margin-bottom: 110px !important; }\n\t.m-b-sm-120 { margin-bottom: 120px !important; }\n\t.m-b-sm-130 { margin-bottom: 130px !important; }\n\t.m-b-sm-140 { margin-bottom: 140px !important; }\n\n\t.p-t-sm-0 { padding-top: 0px !important; }\n\t.p-t-sm-10 { padding-top: 10px !important; }\n\t.p-t-sm-20 { padding-top: 20px !important; }\n\t.p-t-sm-30 { padding-top: 30px !important; }\n\t.p-t-sm-40 { padding-top: 40px !important; }\n\t.p-t-sm-50 { padding-top: 50px !important; }\n\t.p-t-sm-60 { padding-top: 60px !important; }\n\t.p-t-sm-70 { padding-top: 70px !important; }\n\t.p-t-sm-80 { padding-top: 80px !important; }\n\t.p-t-sm-90 { padding-top: 90px !important; }\n\t.p-t-sm-100 { padding-top: 100px !important; }\n\t.p-t-sm-110 { padding-top: 110px !important; }\n\t.p-t-sm-120 { padding-top: 120px !important; }\n\t.p-t-sm-130 { padding-top: 130px !important; }\n\t.p-t-sm-140 { padding-top: 140px !important; }\n\n\t.p-b-sm-0 { padding-bottom: 0px !important; }\n\t.p-b-sm-10 { padding-bottom: 10px !important; }\n\t.p-b-sm-20 { padding-bottom: 20px !important; }\n\t.p-b-sm-30 { padding-bottom: 30px !important; }\n\t.p-b-sm-40 { padding-bottom: 40px !important; }\n\t.p-b-sm-50 { padding-bottom: 50px !important; }\n\t.p-b-sm-60 { padding-bottom: 60px !important; }\n\t.p-b-sm-70 { padding-bottom: 70px !important; }\n\t.p-b-sm-80 { padding-bottom: 80px !important; }\n\t.p-b-sm-90 { padding-bottom: 90px !important; }\n\t.p-b-sm-100 { padding-bottom: 100px !important; }\n\t.p-b-sm-110 { padding-bottom: 110px !important; }\n\t.p-b-sm-120 { padding-bottom: 120px !important; }\n\t.p-b-sm-130 { padding-bottom: 130px !important; }\n\t.p-b-sm-140 { padding-bottom: 140px !important; }\n\n}\n/*@import \"../css/font-awesome.min.css\";*/\n.wrapper {\n    position: relative;\n    margin-left: 250px;\n}\n/*! -----------------------------------------------------------------\n[Master Stylesheet]\n\nProject:     Ajaxtown\nVersion:     1.0\nLast change: 21/03/2017\nPrimary use: Blog\n\n------------------------------------------------------------------\n[General Styles]\n*/\nhtml {\n    height: 100%;\n}\nbody {\n    background: #1f2129;\n    font-family: \"Source Sans Pro\", sans-serif;\n    line-height: 1.6;\n    font-size: 14px;\n    font-weight: 400;\n    color: #333333;\n    -ms-overflow-style: scrollbar;\n    overflow-x: hidden;\n    height: 100%;\n}\nimg {\n    max-width: 100%;\n    height: auto;\n}\niframe {\n    border: 0;\n}\n[contenteditable=\"true\"]:empty:before {\n    content: attr(placeholder);\n    display: block;\n    color: #ccc;\n    cursor: pointer;\n    /* For Firefox */\n}\ninput,\ntextarea,\n[contenteditable=\"true\"]:focus {\n    outline: none;\n}\ninput[type=\"search\"]::-webkit-search-cancel-button {\n    -webkit-appearance: searchfield-cancel-button;\n}\npre.CodeFlask__pre {\n    opacity: 0;\n}\ntextarea.CodeFlask__textarea {\n    opacity: 1;\n}\n.table {\n    tbody tr td:first-child,\n    thead tr th:first-child {\n        padding-left: 16px !important;\n    }\n}\n::-webkit-input-placeholder {\n    color: rgb(185, 185, 185) !important;\n    font-weight: 300;\n}\n.top-head {\n    display: none;\n}\n.home .top-head {\n    display: block;\n}\n.container-fluid {\n    padding: 0 24px;\n}\n.pointer {\n    cursor: pointer;\n}\n.fa {\n    position: relative;\n}\n.fs-small {\n    font-size: 12px;\n}\n.fs-normal {\n    font-size: 14px;\n}\n.fs-medium {\n    font-size: 16px;\n}\n.fs-large {\n    font-size: 18px;\n}\n.hide {\n    display: none;\n}\n/*!------------------------------------------------------------------\n[Typography]\n*/\na {\n    color: #2196f3;\n    -webkit-transition: all 0.125s cubic-bezier(0.3, 0.1, 0.58, 1);\n    transition: all 0.125s cubic-bezier(0.3, 0.1, 0.58, 1);\n}\na:hover,\na:focus {\n    text-decoration: none;\n    outline: none;\n    color: #2196f3;\n}\na:hover {\n    color: #1a82d6;\n}\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n    font-family: \"Roboto Condensed\", sans-serif;\n    text-transform: uppercase;\n    letter-spacing: 1px;\n    font-weight: 400;\n    margin: 0 0 20px;\n}\nh1 {\n    font-size: 22px;\n}\nh2 {\n    font-size: 20px;\n}\nh3 {\n    font-size: 18px;\n}\nh4 {\n    font-size: 16px;\n}\nh5 {\n    font-size: 14px;\n}\nh6 {\n    font-size: 12px;\n}\np,\nul,\nol {\n    margin: 0 0 30px;\n}\npre {\n    border: 0;\n    line-height: 1.9;\n    font-size: 12px;\n    padding: 35px;\n    border-radius: 2px;\n}\nblockquote {\n    border: 0;\n    font-family: Georgia, sans-serif;\n    text-align: center;\n    font-style: italic;\n    font-size: 28px;\n    color: #111;\n    padding: 0;\n    margin: 0;\n}\nblockquote:before {\n    display: block;\n    content: \"\\F10D\";\n    margin: 0 0 30px;\n    font: normal normal normal 14px/1 FontAwesome;\n    font-size: 24px;\n    color: #bbb;\n    -webkit-font-smoothing: antialiased;\n    text-rendering: auto;\n    opacity: 0.3;\n}\nblockquote cite {\n    display: block;\n    font-size: 17px;\n    color: #bbb;\n    margin: 30px 0;\n}\nul {\n    padding-left: 0px;\n    list-style: none;\n}\n.lead {\n    line-height: 1.8;\n    font-size: 18px;\n}\n.font-alt {\n    text-transform: uppercase;\n    letter-spacing: 1px;\n}\n.font-serif {\n    font-family: Georgia, sans-serif;\n    font-style: italic;\n}\n.text-light {\n    color: #fff !important;\n}\n.text-light h1,\n.text-light h2,\n.text-light h3,\n.text-light h4,\n.text-light h5,\n.text-light h6 {\n    color: #fff !important;\n}\n.text-light a {\n    color: rgba(255, 255, 255, .7);\n}\n.text-light a:hover {\n    color: #fff;\n}\n/*!------------------------------------------------------------------\n[Forms]\n*/\n.form-control {\n    border: 0;\n    height: 36px;\n    padding: 13px 0px;\n    font-size: 14px;\n    border-bottom: 1px solid #e5e5e5;\n    color: #000000-light;\n    border-radius: 0px;\n    -webkit-box-shadow: none;\n    -o-box-shadow: none;\n    box-shadow: none;\n    -webkit-transition: 0.3s border-color linear;\n    transition: 0.3s border-color linear;\n    text-transform: none;\n    background: transparent;\n}\n.form-control[disabled] {\n    background: transparent;\n    color: #333333-light;\n}\n.form-control:focus {\n    -webkit-box-shadow: 0px 1px 0px 0px #66afe9;\n            box-shadow: 0px 1px 0px 0px #66afe9;\n}\n.comments-form .control-label {\n    font-weight: 400;\n    font-size: 12px;\n    color: #bbb;\n}\n/*!------------------------------------------------------------------\n[Notification Messages]\n*/\n#notification-wrapper {\n    font-size: 14px;\n}\n/*!------------------------------------------------------------------\n[Modules]\n*/\n.module,\n.module-sm,\n.module-xs {\n    background-attachment: fixed;\n    padding: 140px 0;\n    position: relative;\n    background-repeat: no-repeat;\n    background-position: center center;\n    background-size: cover;\n}\n.module-sm {\n    padding: 70px 0;\n}\n.module-xs {\n    padding: 16px 0;\n    margin: 0 16px;\n}\n.module-title {\n    line-height: 1.4;\n    font-weight: 400;\n    font-size: 15px;\n    color: #000000;\n    text-transform: uppercase;\n}\n.module-subtitle {\n    font-family: \"Roboto\", sans-serif;\n    line-height: 1.8;\n    font-weight: 300;\n    font-size: 13px;\n    color: #333333-light;\n}\n.module-title,\n.module-subtitle {\n    margin: 0 0 16px;\n}\n.module-title + .module-subtitle {\n    margin-top: -16px;\n}\n.divider {\n    border-color: #f5f5f5;\n    margin: 0;\n}\n.to-top-link {\n    position: absolute;\n    bottom: 0;\n    left: 50%;\n    width: 40px;\n    height: 40px;\n    background: #f5f5f5;\n    text-align: center;\n    line-height: 40px;\n    margin-left: -20px;\n}\n.to-top-link:hover {\n    background: #111;\n    color: #fff;\n}\n.loader {\n    margin: 0 0 2em;\n    height: 100px;\n    width: 20%;\n    text-align: center;\n    padding: 1em;\n    margin: 0 auto 1em;\n    display: inline-block;\n    vertical-align: top;\n}\nheader {\n    grid-area: header;\n}\nnav {\n    grid-area: nav;\n}\nmain {\n    grid-area: content;\n}\naside {\n    grid-area: side;\n}\n.two-column.main {display: grid;grid-template-areas:\n            \"header header header\"\n            \"nav content side\"\n            \"footer footer footer\";grid-template-columns: 250px 1fr 400px;grid-template-rows: auto 1fr auto;grid-gap: 16px;height: 100vh;\naside {\n            margin-right: 16px;}}\n@media (max-width: 991px) {\n.two-column.main {grid-template-areas:\n                \"header\"\n                \"nav\"\n                \"content\"\n                \"side\"\n                \"footer\";grid-template-columns: 1fr;grid-template-rows:\n                auto\n                minmax(75px, auto)\n                1fr\n                minmax(75px, auto)\n                auto;\n/*Footer\n*/margin-top: -16px;\nmain {\n                margin: 0 16px;}}\n.two-column {\naside {\n            display: none;}}}\n.centered.main {display: grid;grid-template-areas:\n            \"nav nav nav nav nav\"\n            \" . content content side .\"\n            \"footer footer footer footer footer\";grid-template-columns: 2fr repeat(3, minmax(auto, 368px)) 2fr;grid-template-rows: auto 1fr auto;grid-gap: 16px;height: 100vh;\nnav .sidebar {\n            position: relative;\n            width: auto;}}\n@media (max-width: 991px) {\n.centered.main {grid-template-areas:\n                \"nav\"\n                \"content\"\n                \"side\"\n                \"footer\";grid-template-columns: 1fr;grid-template-rows:\n                auto\n                minmax(75px, auto)\n                1fr\n                minmax(75px, auto)\n                auto;\n/*Footer\n*/margin-top: -16px;\nmain {\n                margin: 0 16px;}}\n.centered {\naside {\n            display: none;}}}\nul.nav {\n    text-transform: uppercase;\n    font-weight: 100;\n    letter-spacing: 1px;\n}\n.navbar-custom {\n    .nav-list li a {\n        text-decoration: none;\n        display: block;\n        padding: 10px;\n        cursor: pointer;\n        color: #b7b7b7;\n    }\n    .nav-list li.active a {\n    }\n    .nav-list > li > a {\n        color: #b7b7b7;\n        padding-left: 13px !important;\n    }\n    .nav-list > li a:hover {\n        border-left: 0px solid #2196f3;\n    }\n    .nav-list a span {\n        margin-left: 20px;\n    }\n    .nav-list .menu-icon {\n        margin-top: 4px;\n    }\n    .nav-list li.has-sub li a {\n        padding-left: 34px !important;\n    }\n    .nav-list li.has-sub.open > a:after {content: \"\\F068\";}\n    .nav-list li.has-sub {\n> a:after {\n            content: \"\\F067\";\n            position: relative;\n            font-family: \"FontAwesome\";\n            float: right;\n            margin-right: 16px;}}\n}\nh3.widget-title {\n    font-size: 14px;\n}\nh3.widget-title:before {\n    content: \"\";\n    border-left: 2px solid #333;\n    margin-right: 5px;\n}\n/*!------------------------------------------------------------------\n[Card]\n*/\n.card {\n    background: #fff;\n    padding: 20px;\n    margin-bottom: 12px;\n}\n.post-grid {\n    .card {\n        margin-bottom: 0px;\n    }\n}\n.post-grid:not(.with-padding) {\n.card {\n            padding: 0px;}\n.post {\n            margin-bottom: 0px;\n            .post-content {\n                padding: 20px;\n            }\n            .post-header {\n                margin: 0px 20px;\n                padding-top: 20px;\n                .post-title {\n                    margin-bottom: 0px;\n                }\n            }\n            .post-body.with-border {\n                border: 1px solid #eee;\n            }}}\n/*!------------------------------------------------------------------\n[Tags]\n*/\n.tags a {\n    position: relative;\n    background: #f5f5f5;\n    display: inline-block;\n    padding: 6px 20px 5px 10px;\n    margin: 0px 15px 10px 0;\n    font-size: 11px;\n    -webkit-transition: all 0.125s cubic-bezier(0.3, 0.1, 0.58, 1);\n    transition: all 0.125s cubic-bezier(0.3, 0.1, 0.58, 1);\n    border-radius: 2px 0 0 2px;\n}\n.tags a:before {\n    border-top: 13px solid rgba(0, 0, 0, 0);\n    border-left: 9px solid #f5f5f5;\n    border-bottom: 13px solid rgba(0, 0, 0, 0);\n    position: absolute;\n    content: \"\";\n    right: -9px;\n    top: 2px;\n    height: 0;\n    width: 0;\n    -webkit-transition: all 0.125s cubic-bezier(0.3, 0.1, 0.58, 1);\n    transition: all 0.125s cubic-bezier(0.3, 0.1, 0.58, 1);\n}\n.tags a:after {\n    background: #fff;\n    position: absolute;\n    display: block;\n    content: \"\";\n    right: 4px;\n    top: 12px;\n    height: 4px;\n    width: 4px;\n    border-radius: 50%;\n}\n.tags a:hover {\n    background: #eee;\n}\n.tags a:hover:before {\n    border-left-color: #eee;\n}\n.sidebar {\n    position: fixed;\n    width: 250px;\n    background-color: #1f2129;\n    height: 100%;\n    top: 0;\n    left: 0;\n    z-index: 999;\n    background-repeat: no-repeat;\n    background-position: center center;\n    background-size: cover;\n    a {\n        color: rgba(255, 255, 255, .7)\n    }\n    a:hover {color: #fff;}\n    .copyright {\n        position: absolute;\n        width: 100%;\n        bottom: 0;\n        left: 0;\n        padding: 15px 30px;\n        font-size: 13px;\n        font-weight: 300;\n        color: #b7b7b7;\n    }\n    .social-icons a {\n        font-size: 12px;\n        margin-right: 10px;\n        position: relative;\n    }\n}\n.sidebar.nav {width: 95%;}\n.nav.child_menu {\n    display: block;\n}\n@media screen and (max-width: 767px) {\n    .row-offcanvas {\n        position: relative;\n        -webkit-transition: all 0.25s ease-out;\n        transition: all 0.25s ease-out;\n    }\n    .row-offcanvas-right .sidebar-offcanvas {\n        right: -41.6%;\n    }\n    .row-offcanvas-left .sidebar-offcanvas {\n        left: -41.6%;\n    }\n    .row-offcanvas-right.active {\n        right: 41.6%;\n    }\n    .row-offcanvas-left.active {\n        left: 41.6%;\n    }\n    .sidebar-offcanvas {\n        position: absolute;\n        top: 0;\n        width: 41.6%;\n    }\n    #sidebar {\n        padding-top: 0;\n    }\n}\n@media (max-width: 991px) {\n    .sidebar {\n        position: relative;\n        z-index: 99999;\n        height: auto;\n        width: 100%;\n        padding: 0\n    }\n    .sidebar:after {content: normal;}\n    .sidebar {\n.copyright {\n            display: none;}}\n    .wrapper {\n        margin-left: 0;\n    }\n}\n/*!------------------------------------------------------------------\n[Navbar]\n*/\n.navbar-brand {\n    font-weight: 100;\n    font-size: 23px;\n    text-transform: uppercase;\n    letter-spacing: 2px;\n}\n.navbar-custom {\n    background: transparent;\n    border: 0;\n    padding: 0;\n    margin: 0;\n    .navbar-brand {\n        display: table-cell;\n        vertical-align: middle;\n        float: none;\n        height: 70px;\n        padding-top: 0;\n        padding-bottom: 0;\n        color: #b7b7b7;\n        width: 100vw;\n        text-shadow: 1px 1px 0 #000;\n        small {\n            display: block;\n            font-size: 12px;\n            font-family: \"Source Sans Pro\", sans-serif;\n        }\n    }\n    li > a,\n    .dropdown-menu li > a {\n        color: #b7b7b7;\n    }\n    .nav {\n        > li > a:hover {background: transparent;color: #fff;}\n        > li > a:focus {background: transparent;border-color: transparent;}\n        .open > a {\n            background: transparent\n        }\n        .open > a:hover {background: transparent;color: #fff;}\n        .open > a:focus {background: transparent;}\n    }\n    .dropdown-menu {\n        > li > a:hover,\n            > li > a:focus {background: transparent;color: #2196f3;}\n        background: rgba(26, 26, 26, .9);\n        border: 0;\n        padding: 5px 0;\n        -webkit-box-shadow: none;\n        -o-box-shadow: none;\n        box-shadow: none;\n        border-radius: 0;\n    }\n    .navbar-toggle {\n        .icon-bar {\n            background: #fff;\n        }\n        padding: 0;\n        margin: 27px 15px 0 0;\n    }\n    .navbar-nav {\n        margin-top: 0;\n        margin-bottom: 0;\n        padding: 0px 0 0px 20px;\n    }\n    .navbar-collapse {\n        -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, .05);\n        -o-box-shadow: inset 0 1px 0 rgba(255, 255, 255, .05);\n        box-shadow: inset 0 1px 0 rgba(255, 255, 255, .05);\n    }\n    .navbar-nav {\n        i {\n            width: 12px;\n        }\n        .menu-icon {\n            margin-left: -20px;\n            margin-top: 6px;\n            font-size: 12px;\n            color: #2196f3;\n        }\n        > li.item a {\n            margin-left: 10px;\n        }\n        ul {\n            list-style: none;\n        }\n        .parent {\n            padding-bottom: 4px;\n        }\n    }\n}\n@media (min-width: 992px) {\n    .navbar-custom {\n        .navbar-header {\n            float: none;\n            margin: 0 0 10px;\n            padding: 20px 20px;\n        }\n        .navbar-nav {\n            float: none;\n            li {\n                float: none;\n            }\n        }\n        li > a,\n        .dropdown-menu li > a {\n            padding-top: 12px;\n            padding-bottom: 12px;\n        }\n        li.dropdown > a:after {\n            position: absolute;\n            display: block;\n            right: 35px;\n            top: 50%;\n            margin-top: -6px;\n            font: normal normal normal 14px/1 FontAwesome;\n            font-size: 10px;\n            content: \"\\F105\";\n            text-rendering: auto;\n            -webkit-font-smoothing: antialiased;\n            -moz-osx-font-smoothing: grayscale;\n        }\n        .dropdown-menu {\n            top: -5px;\n            left: 100%;\n            min-width: 200px;\n        }\n        .navbar-collapse {\n            padding-left: 0;\n            padding-right: 0;\n            -webkit-box-shadow: none;\n                    box-shadow: none;\n        }\n    }\n}\n@media (max-width: 991px) {\n    .navbar-custom li > a {\n        -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, .05);\n        -o-box-shadow: inset 0 1px 0 rgba(255, 255, 255, .05);\n        box-shadow: inset 0 1px 0 rgba(255, 255, 255, .05);\n    }\n    .navbar-custom .navbar-nav .open .dropdown-menu > li > a,\n    .navbar-custom .navbar-nav .open .dropdown-menu .dropdown-header {\n        padding: 10px 15px 10px 25px;\n    }\n    .navbar-nav > li > .dropdown-menu {\n        padding-top: 0;\n        padding-bottom: 0;\n    }\n}\n/*!------------------------------------------------------------------\n[Post]\n*/\n.post-thumbnail img {\n    width: 100%;\n    max-width: none;\n}\n.post {\n    margin-bottom: 20px;\n    h1:first-child,\n    h2:first-child,\n    h3:first-child,\n    h4:first-child,\n    h5:first-child,\n    h6:first-child {\n        margin-top: 0px;\n    }\n    p > img {\n        width: 100%;\n        max-width: none;\n    }\n    .post-header {\n        margin: 16px 0 16px;\n        .post-meta {\n            color: rgb(185, 185, 185);\n        }\n    }\n\n    .post-content {\n        padding-bottom: 20px;\n        padding: 0px;\n    }\n\n    .post-title {\n        font-weight: 500;\n        min-height: 20px;\n        margin: 0 0 10px;\n        text-transform: none;\n        text-transform: initial;\n        a {\n            font-weight: 500;\n            color: #333333;\n            margin: 0 0 10px;\n        }\n    }\n    a.post-more {\n        background: #000000;\n        color: #e5e5e5;\n        border: 1px solid #000000;\n        padding: 6px 10px;\n        -webkit-transition: all 0.2s linear;\n        transition: all 0.2s linear;\n        text-transform: uppercase;\n        letter-spacing: 2px;\n        font-size: 11px\n    }\n    a.post-more:hover {background: #e5e5e5;color: #000000;border: 1px solid #000000;}\n    .slider {\n        img {\n            margin-left: 0;\n            margin-right: 0;\n        }\n    }\n    .slider.owl-carousel {width: 120%;margin-left: -10%;margin-right: -10%;}\n    .fluid-width-video-wrapper {\n        width: 120%;\n        margin-left: -10%;\n        margin-right: -10%;\n    }\n    .gallery {\n        margin-left: -10%;\n        margin-right: -10%;\n    }\n    blockquote {\n        margin: 60px -10%;\n    }\n}\n@media (max-width: 991px) {\n    .post p > img,\n    .post-thumbnail img {\n        max-width: 100%;\n        margin-left: 0;\n        margin-right: 0;\n    }\n    .post {\n        .slider.owl-carousel,\n        .fluid-width-video-wrapper {\n            max-width: 100%;\n            margin-left: 0;\n            margin-right: 0;\n        }\n        pre,\n        .gallery,\n        blockquote {\n            margin-left: 0;\n            margin-right: 0;\n        }\n    }\n}\n.dropdown-submenu {\n    position: relative;\n}\n.dropdown-submenu > .dropdown-menu {\n    top: 0;\n    left: 100%;\n    margin-top: -6px;\n    margin-left: -1px;\n    border-radius: 0 6px 6px 6px;\n}\n.dropdown-submenu:hover > .dropdown-menu {\n    display: block;\n}\n.dropdown-submenu > a:after {\n    display: block;\n    content: \" \";\n    float: right;\n    width: 0;\n    height: 0;\n    border-color: transparent;\n    border-style: solid;\n    border-width: 5px 0 5px 5px;\n    border-left-color: #ccc;\n    margin-top: 5px;\n    margin-right: -10px;\n}\n.dropdown-submenu:hover > a:after {\n    border-left-color: #fff;\n}\n.dropdown-submenu.pull-left {\n    float: none;\n}\n.dropdown-submenu.pull-left > .dropdown-menu {\n    left: -100%;\n    margin-left: 10px;\n    border-radius: 6px 0 6px 6px;\n}\n", ""]);

// exports


/***/ }),

/***/ "./shared/queries/Queries.js":
/*!***********************************!*\
  !*** ./shared/queries/Queries.js ***!
  \***********************************/
/*! exports provided: GET_POSTS, GET_SINGLE_POST, GET_POST_BY_SLUG, GET_PAGE_NAMES, GET_MEDIA, GET_AUTHORS, GET_AUTHOR, GET_ROLES, GET_OPTIONS, GET_TAXONOMIES, SEARCH_POSTS, SEARCH_POSTS_BY_TAXONOMY, BLOG_STATS, TAX_SUGGESTIONS, GET_POSTS_LINKED_TAXONOMIES, GET_LATEST_PUBLISHED_POSTS, CAT_POSTS, PAGE_MENU, ADJACENT_POSTS */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_POSTS", function() { return GET_POSTS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_SINGLE_POST", function() { return GET_SINGLE_POST; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_POST_BY_SLUG", function() { return GET_POST_BY_SLUG; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_PAGE_NAMES", function() { return GET_PAGE_NAMES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_MEDIA", function() { return GET_MEDIA; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_AUTHORS", function() { return GET_AUTHORS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_AUTHOR", function() { return GET_AUTHOR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_ROLES", function() { return GET_ROLES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_OPTIONS", function() { return GET_OPTIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_TAXONOMIES", function() { return GET_TAXONOMIES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SEARCH_POSTS", function() { return SEARCH_POSTS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SEARCH_POSTS_BY_TAXONOMY", function() { return SEARCH_POSTS_BY_TAXONOMY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BLOG_STATS", function() { return BLOG_STATS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TAX_SUGGESTIONS", function() { return TAX_SUGGESTIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_POSTS_LINKED_TAXONOMIES", function() { return GET_POSTS_LINKED_TAXONOMIES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_LATEST_PUBLISHED_POSTS", function() { return GET_LATEST_PUBLISHED_POSTS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAT_POSTS", function() { return CAT_POSTS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PAGE_MENU", function() { return PAGE_MENU; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ADJACENT_POSTS", function() { return ADJACENT_POSTS; });
/* harmony import */ var graphql_tag__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! graphql-tag */ "graphql-tag");
/* harmony import */ var graphql_tag__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(graphql_tag__WEBPACK_IMPORTED_MODULE_0__);


const GET_POSTS = graphql_tag__WEBPACK_IMPORTED_MODULE_0___default.a`
    query getPosts($type: String!, $offset: Int, $limit: Int, $status: String) {
        posts(type: $type, offset: $offset, limit: $limit, status: $status) {
            count
            rows {
                id
                title
                body
                author {
                    fname
                    lname
                }
                type
                slug
                mode
                status
                created_at
                excerpt
                taxonomies {
                    id
                    name
                    type
                }
            }
        }
    }
`;

const GET_SINGLE_POST = graphql_tag__WEBPACK_IMPORTED_MODULE_0___default.a`
    query getPost($id: Int!) {
        post(id: $id) {
            id
            title
            body
            author {
                fname
                lname
            }
            type
            status
            mode
            created_at
            cover_image
            excerpt
            slug
            taxonomies {
                id
                name
                type
            }
        }
    }
`;

const GET_POST_BY_SLUG = graphql_tag__WEBPACK_IMPORTED_MODULE_0___default.a`
    query singlePost($type: String, $slug: String) {
        post(type: $type, slug: $slug) {
            id
            title
            body
            status
            created_at
            excerpt
            mode
            cover_image
            taxonomies {
                id
                name
                type
                slug
            }
        }
    }
`;

const GET_PAGE_NAMES = graphql_tag__WEBPACK_IMPORTED_MODULE_0___default.a`
    query getPosts($type: String!, $status: String) {
        posts(type: $type, status: $status) {
            count
            rows {
                id
                title
                slug
            }
        }
    }
`;

const GET_MEDIA = graphql_tag__WEBPACK_IMPORTED_MODULE_0___default.a`
    query getMedia($author_id: Int!, $offset: Int, $limit: Int) {
        media(author_id: $author_id, offset: $offset, limit: $limit) {
            count
            rows {
                id
                url
                created_at
            }
        }
    }
`;

const GET_AUTHORS = graphql_tag__WEBPACK_IMPORTED_MODULE_0___default.a`
    query getAuthors {
        authors {
            id
            email
            fname
            lname
            username
            avatar
            role {
                name
                permissions {
                    name
                }
            }
        }
    }
`;

const GET_AUTHOR = graphql_tag__WEBPACK_IMPORTED_MODULE_0___default.a`
    query getAuthor($id: Int!) {
        author(id: $id) {
            id
            username
            email
            fname
            lname
            social
            avatar
            role {
                name
                permissions {
                    name
                }
            }
        }
    }
`;

const GET_ROLES = graphql_tag__WEBPACK_IMPORTED_MODULE_0___default.a`
    query getRoles {
        roles {
            id
            name
        }
    }
`;
const GET_OPTIONS = graphql_tag__WEBPACK_IMPORTED_MODULE_0___default.a`
    query getOptions {
        settings {
            id
            option
            value
        }
    }
`;

const GET_TAXONOMIES = graphql_tag__WEBPACK_IMPORTED_MODULE_0___default.a`
    query getTaxonomies($type: String!) {
        taxonomies(type: $type) {
            id
            name
            desc
            slug
        }
    }
`;

const SEARCH_POSTS = graphql_tag__WEBPACK_IMPORTED_MODULE_0___default.a`
    query searchPosts(
        $type: String
        $query: String!
        $offset: Int
        $limit: Int
        $status: String
    ) {
        posts(
            body: $query
            offset: $offset
            limit: $limit
            type: $type
            status: $status
        ) {
            count
            rows {
                id
                title
                body
                author {
                    fname
                    lname
                }
                type
                slug
                status
                created_at
                excerpt
                cover_image
                taxonomies {
                    id
                    name
                    type
                }
            }
        }
    }
`;

const SEARCH_POSTS_BY_TAXONOMY = graphql_tag__WEBPACK_IMPORTED_MODULE_0___default.a`
    query catPosts(
        $type: String
        $slug: String
        $postType: String
        $offset: Int
        $limit: Int
    ) {
        postsByTaxSlug(
            postType: $postType
            offset: $offset
            limit: $limit
            type: $type
            slug: $slug
        ) {
            count
            posts {
                id
                title
                body
                type
                cover_image
                created_at
                slug
                excerpt
                taxonomies {
                    id
                    name
                    type
                }
            }
        }
    }
`;

const BLOG_STATS = graphql_tag__WEBPACK_IMPORTED_MODULE_0___default.a`
    query stats {
        stats {
            posts {
                published
                drafts
            }
            pages {
                published
                drafts
            }
            tags
            categories
        }
    }
`;

const TAX_SUGGESTIONS = graphql_tag__WEBPACK_IMPORTED_MODULE_0___default.a`
    query getTaxonomies($type: String!) {
        taxonomies(type: $type) {
            id
            name
        }
    }
`;

const GET_POSTS_LINKED_TAXONOMIES = graphql_tag__WEBPACK_IMPORTED_MODULE_0___default.a`
    query getTaxonomies($type: String!, $postType: String) {
        postTaxonomies(type: $type, postType: $postType) {
            id
            name
            type
            slug
        }
    }
`;

const GET_LATEST_PUBLISHED_POSTS = graphql_tag__WEBPACK_IMPORTED_MODULE_0___default.a`
    query latestPosts($type: String, $limit: Int) {
        posts(type: $type, offset: 0, limit: $limit) {
            count
            rows {
                id
                title
                type
                slug
                created_at
                cover_image
            }
        }
    }
`;

const CAT_POSTS = graphql_tag__WEBPACK_IMPORTED_MODULE_0___default.a`
    query allPosts(
        $type: String
        $slug: String
        $postType: String
        $offset: Int
        $limit: Int
    ) {
        postsMenu(
            postType: $postType
            limit: $limit
            offset: $offset
            type: $type
            slug: $slug
        ) {
            count
            posts {
                id
                title
                type
                cover_image
                created_at
                slug
                excerpt
                taxonomies {
                    id
                    name
                    type
                }
            }
        }
    }
`;

const PAGE_MENU = graphql_tag__WEBPACK_IMPORTED_MODULE_0___default.a`
    query pageMenu($slug: String, $postType: String) {
        pageMenu(slug: $slug, postType: $postType) {
            ok
            post {
                id
                title
                body
                status
                created_at
                excerpt
                cover_image
                slug
                taxonomies {
                    id
                    name
                    type
                }
            }
            errors {
                message
            }
        }
    }
`;

const ADJACENT_POSTS = graphql_tag__WEBPACK_IMPORTED_MODULE_0___default.a`
    query adjacentPosts($slug: String) {
        adjacentPosts(type: "post", slug: $slug) {
            next {
                title
                slug
            }
            previous {
                title
                slug
            }
        }
    }
`;


/***/ }),

/***/ 0:
/*!***********************************************!*\
  !*** multi babel-polyfill ./client/server.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! babel-polyfill */"babel-polyfill");
module.exports = __webpack_require__(/*! /Users/ajaxtown/Sites/ReactCMS/client/server.js */"./client/server.js");


/***/ }),

/***/ "apollo-cache-inmemory":
/*!****************************************!*\
  !*** external "apollo-cache-inmemory" ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("apollo-cache-inmemory");

/***/ }),

/***/ "apollo-client":
/*!********************************!*\
  !*** external "apollo-client" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("apollo-client");

/***/ }),

/***/ "apollo-link":
/*!******************************!*\
  !*** external "apollo-link" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("apollo-link");

/***/ }),

/***/ "apollo-link-error":
/*!************************************!*\
  !*** external "apollo-link-error" ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("apollo-link-error");

/***/ }),

/***/ "apollo-link-http":
/*!***********************************!*\
  !*** external "apollo-link-http" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("apollo-link-http");

/***/ }),

/***/ "babel-polyfill":
/*!*********************************!*\
  !*** external "babel-polyfill" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("babel-polyfill");

/***/ }),

/***/ "classnames":
/*!*****************************!*\
  !*** external "classnames" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("classnames");

/***/ }),

/***/ "graphql-tag":
/*!******************************!*\
  !*** external "graphql-tag" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("graphql-tag");

/***/ }),

/***/ "moment":
/*!*************************!*\
  !*** external "moment" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("moment");

/***/ }),

/***/ "object-assign":
/*!********************************!*\
  !*** external "object-assign" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("object-assign");

/***/ }),

/***/ "prop-types":
/*!*****************************!*\
  !*** external "prop-types" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("prop-types");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),

/***/ "react-apollo":
/*!*******************************!*\
  !*** external "react-apollo" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-apollo");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-dom");

/***/ }),

/***/ "react-helmet":
/*!*******************************!*\
  !*** external "react-helmet" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-helmet");

/***/ }),

/***/ "react-infinite-scroller":
/*!******************************************!*\
  !*** external "react-infinite-scroller" ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-infinite-scroller");

/***/ }),

/***/ "react-router":
/*!*******************************!*\
  !*** external "react-router" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-router");

/***/ }),

/***/ "react-router-dom":
/*!***********************************!*\
  !*** external "react-router-dom" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-router-dom");

/***/ }),

/***/ "react-stack-grid":
/*!***********************************!*\
  !*** external "react-stack-grid" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-stack-grid");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("stream");

/***/ }),

/***/ "whatwg-fetch":
/*!*******************************!*\
  !*** external "whatwg-fetch" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("whatwg-fetch");

/***/ })

/******/ });
//# sourceMappingURL=amun.node.js.map