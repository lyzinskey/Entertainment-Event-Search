"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var DEGREE_IN_RADIANS = Math.PI / 180;
var RoundProgressService = /** @class */ (function () {
    function RoundProgressService(document) {
        this.supportsSvg = !!(document &&
            document.createElementNS &&
            document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect);
        this._base = document && document.head.querySelector('base');
        this._hasPerf = typeof window !== 'undefined' &&
            window.performance &&
            window.performance.now &&
            typeof window.performance.now() === 'number';
    }
    /**
     * Resolves a SVG color against the page's `base` tag.
     */
    /**
       * Resolves a SVG color against the page's `base` tag.
       */
    RoundProgressService.prototype.resolveColor = /**
       * Resolves a SVG color against the page's `base` tag.
       */
    function (color) {
        if (this._base && this._base.href) {
            var hashIndex = color.indexOf('#');
            if (hashIndex > -1 && color.indexOf('url') > -1) {
                return color.slice(0, hashIndex) + location.href + color.slice(hashIndex);
            }
        }
        return color;
    };
    /**
     * Generates a timestamp.
     */
    /**
       * Generates a timestamp.
       */
    RoundProgressService.prototype.getTimestamp = /**
       * Generates a timestamp.
       */
    function () {
        return this._hasPerf ? window.performance.now() : Date.now();
    };
    /**
     * Generates the value for an SVG arc.
     * @param current       Current value.
     * @param total         Maximum value.
     * @param pathRadius    Radius of the SVG path.
     * @param elementRadius Radius of the SVG container.
     * @param isSemicircle  Whether the element should be a semicircle.
     */
    /**
       * Generates the value for an SVG arc.
       * @param current       Current value.
       * @param total         Maximum value.
       * @param pathRadius    Radius of the SVG path.
       * @param elementRadius Radius of the SVG container.
       * @param isSemicircle  Whether the element should be a semicircle.
       */
    RoundProgressService.prototype.getArc = /**
       * Generates the value for an SVG arc.
       * @param current       Current value.
       * @param total         Maximum value.
       * @param pathRadius    Radius of the SVG path.
       * @param elementRadius Radius of the SVG container.
       * @param isSemicircle  Whether the element should be a semicircle.
       */
    function (current, total, pathRadius, elementRadius, isSemicircle) {
        if (isSemicircle === void 0) { isSemicircle = false; }
        var value = Math.max(0, Math.min(current || 0, total));
        var maxAngle = isSemicircle ? 180 : 359.9999;
        var percentage = total === 0 ? maxAngle : (value / total) * maxAngle;
        var start = this._polarToCartesian(elementRadius, pathRadius, percentage);
        var end = this._polarToCartesian(elementRadius, pathRadius, 0);
        var arcSweep = (percentage <= 180 ? 0 : 1);
        return "M " + start + " A " + pathRadius + " " + pathRadius + " 0 " + arcSweep + " 0 " + end;
    };
    ;
    /**
     * Converts polar cooradinates to Cartesian.
     * @param elementRadius  Radius of the wrapper element.
     * @param pathRadius     Radius of the path being described.
     * @param angleInDegrees Degree to be converted.
     */
    /**
       * Converts polar cooradinates to Cartesian.
       * @param elementRadius  Radius of the wrapper element.
       * @param pathRadius     Radius of the path being described.
       * @param angleInDegrees Degree to be converted.
       */
    RoundProgressService.prototype._polarToCartesian = /**
       * Converts polar cooradinates to Cartesian.
       * @param elementRadius  Radius of the wrapper element.
       * @param pathRadius     Radius of the path being described.
       * @param angleInDegrees Degree to be converted.
       */
    function (elementRadius, pathRadius, angleInDegrees) {
        var angleInRadians = (angleInDegrees - 90) * DEGREE_IN_RADIANS;
        var x = elementRadius + (pathRadius * Math.cos(angleInRadians));
        var y = elementRadius + (pathRadius * Math.sin(angleInRadians));
        return x + ' ' + y;
    };
    RoundProgressService.decorators = [
        { type: core_1.Injectable },
    ];
    /** @nocollapse */
    RoundProgressService.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: core_1.Optional }, { type: core_1.Inject, args: [platform_browser_1.DOCUMENT,] },] },
    ]; };
    return RoundProgressService;
}());
exports.RoundProgressService = RoundProgressService;
;
//# sourceMappingURL=round-progress.service.js.map