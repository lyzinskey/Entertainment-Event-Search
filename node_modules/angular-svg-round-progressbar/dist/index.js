"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var round_progress_component_1 = require("./round-progress.component");
var round_progress_service_1 = require("./round-progress.service");
var round_progress_ease_1 = require("./round-progress.ease");
var round_progress_config_1 = require("./round-progress.config");
var RoundProgressModule = /** @class */ (function () {
    function RoundProgressModule() {
    }
    RoundProgressModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [common_1.CommonModule],
                    declarations: [round_progress_component_1.RoundProgressComponent],
                    exports: [round_progress_component_1.RoundProgressComponent],
                    providers: [round_progress_service_1.RoundProgressService, round_progress_ease_1.RoundProgressEase, round_progress_config_1.ROUND_PROGRESS_DEFAULTS_PROVIDER]
                },] },
    ];
    return RoundProgressModule;
}());
exports.RoundProgressModule = RoundProgressModule;
;
__export(require("./round-progress.component"));
__export(require("./round-progress.service"));
__export(require("./round-progress.ease"));
__export(require("./round-progress.config"));
//# sourceMappingURL=index.js.map