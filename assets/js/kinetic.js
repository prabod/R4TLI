/**
 * KineticJS JavaScript Framework v4.5.3
 * http://www.kineticjs.com/
 * Copyright 2013, Eric Rowell
 * Licensed under the MIT or GPL Version 2 licenses.
 * Date: May 31 2013
 *
 * Copyright (C) 2011 - 2013 by Eric Rowell
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var Kinetic = {};
(function() {
	Kinetic.version = "4.5.3", Kinetic.Filters = {}, Kinetic.Node = function(a) {
		this._nodeInit(a)
	}, Kinetic.Shape = function(a) {
		this._initShape(a)
	}, Kinetic.Container = function(a) {
		this._containerInit(a)
	}, Kinetic.Stage = function(a) {
		this._initStage(a)
	}, Kinetic.Layer = function(a) {
		this._initLayer(a)
	}, Kinetic.Group = function(a) {
		this._initGroup(a)
	}, Kinetic.Global = {
		stages: [],
		idCounter: 0,
		ids: {},
		names: {},
		shapes: {},
		isDragging: function() {
			var a = Kinetic.DD;
			return a ? a.isDragging : !1
		},
		isDragReady: function() {
			var a = Kinetic.DD;
			return a ? !!a.node : !1
		},
		_addId: function(a, b) {
			b !== undefined && (this.ids[b] = a)
		},
		_removeId: function(a) {
			a !== undefined && delete this.ids[a]
		},
		_addName: function(a, b) {
			b !== undefined && (this.names[b] === undefined && (this.names[b] = []), this.names[b].push(a))
		},
		_removeName: function(a, b) {
			if (a !== undefined) {
				var c = this.names[a];
				if (c !== undefined) {
					for (var d = 0; d < c.length; d++) {
						var e = c[d];
						e._id === b && c.splice(d, 1)
					}
					c.length === 0 && delete this.names[a]
				}
			}
		}
	}
})(),
function(a, b) {
	typeof exports == "object" ? module.exports = b() : typeof define == "function" && define.amd ? define(b) : a.returnExports = b()
}(this, function() {
	return Kinetic
}),
function() {
	Kinetic.Collection = function() {
		var a = [].slice.call(arguments),
			b = a.length,
			c = 0;
		this.length = b;
		for (; c < b; c++) this[c] = a[c];
		return this
	}, Kinetic.Collection.prototype = new Array, Kinetic.Collection.prototype.each = function(a) {
		for (var b = 0; b < this.length; b++) a(this[b], b)
	}, Kinetic.Collection.prototype.toArray = function() {
		var a = [];
		for (var b = 0; b < this.length; b++) a.push(this[b]);
		return a
	}, Kinetic.Collection.mapMethods = function(a) {
		var b = a.length,
			c;
		for (c = 0; c < b; c++)(function(b) {
			var c = a[b];
			Kinetic.Collection.prototype[c] = function() {
				var a = this.length,
					b;
				args = [].slice.call(arguments);
				for (b = 0; b < a; b++) this[b][c].apply(this[b], args)
			}
		})(c)
	}
}(),
function() {
	Kinetic.Transform = function() {
		this.m = [1, 0, 0, 1, 0, 0]
	}, Kinetic.Transform.prototype = {
		translate: function(a, b) {
			this.m[4] += this.m[0] * a + this.m[2] * b, this.m[5] += this.m[1] * a + this.m[3] * b
		},
		scale: function(a, b) {
			this.m[0] *= a, this.m[1] *= a, this.m[2] *= b, this.m[3] *= b
		},
		rotate: function(a) {
			var b = Math.cos(a),
				c = Math.sin(a),
				d = this.m[0] * b + this.m[2] * c,
				e = this.m[1] * b + this.m[3] * c,
				f = this.m[0] * -c + this.m[2] * b,
				g = this.m[1] * -c + this.m[3] * b;
			this.m[0] = d, this.m[1] = e, this.m[2] = f, this.m[3] = g
		},
		getTranslation: function() {
			return {
				x: this.m[4],
				y: this.m[5]
			}
		},
		skew: function(a, b) {
			var c = this.m[0] + this.m[2] * b,
				d = this.m[1] + this.m[3] * b,
				e = this.m[2] + this.m[0] * a,
				f = this.m[3] + this.m[1] * a;
			this.m[0] = c, this.m[1] = d, this.m[2] = e, this.m[3] = f
		},
		multiply: function(a) {
			var b = this.m[0] * a.m[0] + this.m[2] * a.m[1],
				c = this.m[1] * a.m[0] + this.m[3] * a.m[1],
				d = this.m[0] * a.m[2] + this.m[2] * a.m[3],
				e = this.m[1] * a.m[2] + this.m[3] * a.m[3],
				f = this.m[0] * a.m[4] + this.m[2] * a.m[5] + this.m[4],
				g = this.m[1] * a.m[4] + this.m[3] * a.m[5] + this.m[5];
			this.m[0] = b, this.m[1] = c, this.m[2] = d, this.m[3] = e, this.m[4] = f, this.m[5] = g
		},
		invert: function() {
			var a = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]),
				b = this.m[3] * a,
				c = -this.m[1] * a,
				d = -this.m[2] * a,
				e = this.m[0] * a,
				f = a * (this.m[2] * this.m[5] - this.m[3] * this.m[4]),
				g = a * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
			this.m[0] = b, this.m[1] = c, this.m[2] = d, this.m[3] = e, this.m[4] = f, this.m[5] = g
		},
		getMatrix: function() {
			return this.m
		}
	}
}(),
function() {
	var a = "canvas",
		b = "2d",
		c = "[object Array]",
		d = "[object Number]",
		e = "[object String]",
		f = Math.PI / 180,
		g = 180 / Math.PI,
		h = "#",
		i = "",
		j = "0",
		k = "Kinetic warning: ",
		l = "rgb(",
		m = {
			aqua: [0, 255, 255],
			lime: [0, 255, 0],
			silver: [192, 192, 192],
			black: [0, 0, 0],
			maroon: [128, 0, 0],
			teal: [0, 128, 128],
			blue: [0, 0, 255],
			navy: [0, 0, 128],
			white: [255, 255, 255],
			fuchsia: [255, 0, 255],
			olive: [128, 128, 0],
			yellow: [255, 255, 0],
			orange: [255, 165, 0],
			gray: [128, 128, 128],
			purple: [128, 0, 128],
			green: [0, 128, 0],
			red: [255, 0, 0],
			pink: [255, 192, 203],
			cyan: [0, 255, 255],
			transparent: [255, 255, 255, 0]
		},
		n = /rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/;
	Kinetic.Util = {
		_isElement: function(a) {
			return !!a && a.nodeType == 1
		},
		_isFunction: function(a) {
			return !!(a && a.constructor && a.call && a.apply)
		},
		_isObject: function(a) {
			return !!a && a.constructor == Object
		},
		_isArray: function(a) {
			return Object.prototype.toString.call(a) == c
		},
		_isNumber: function(a) {
			return Object.prototype.toString.call(a) == d
		},
		_isString: function(a) {
			return Object.prototype.toString.call(a) == e
		},
		_hasMethods: function(a) {
			var b = [],
				c;
			for (c in a) this._isFunction(a[c]) && b.push(c);
			return b.length > 0
		},
		_isInDocument: function(a) {
			while (a = a.parentNode)
				if (a == document) return !0;
			return !1
		},
		_getXY: function(a) {
			if (this._isNumber(a)) return {
				x: a,
				y: a
			};
			if (this._isArray(a)) {
				if (a.length === 1) {
					var b = a[0];
					if (this._isNumber(b)) return {
						x: b,
						y: b
					};
					if (this._isArray(b)) return {
						x: b[0],
						y: b[1]
					};
					if (this._isObject(b)) return b
				} else if (a.length >= 2) return {
					x: a[0],
					y: a[1]
				}
			} else if (this._isObject(a)) return a;
			return null
		},
		_getSize: function(a) {
			if (this._isNumber(a)) return {
				width: a,
				height: a
			};
			if (this._isArray(a))
				if (a.length === 1) {
					var b = a[0];
					if (this._isNumber(b)) return {
						width: b,
						height: b
					};
					if (this._isArray(b)) {
						if (b.length >= 4) return {
							width: b[2],
							height: b[3]
						};
						if (b.length >= 2) return {
							width: b[0],
							height: b[1]
						}
					} else if (this._isObject(b)) return b
				} else {
					if (a.length >= 4) return {
						width: a[2],
						height: a[3]
					};
					if (a.length >= 2) return {
						width: a[0],
						height: a[1]
					}
				} else if (this._isObject(a)) return a;
			return null
		},
		_getPoints: function(a) {
			if (a === undefined) return [];
			if (this._isArray(a[0])) {
				var b = [];
				for (var c = 0; c < a.length; c++) b.push({
					x: a[c][0],
					y: a[c][1]
				});
				return b
			}
			if (this._isObject(a[0])) return a;
			var b = [];
			for (var c = 0; c < a.length; c += 2) b.push({
				x: a[c],
				y: a[c + 1]
			});
			return b
		},
		_getImage: function(c, d) {
			var e, f, g, h;
			c ? this._isElement(c) ? d(c) : this._isString(c) ? (e = new Image, e.onload = function() {
				d(e)
			}, e.src = c) : c.data ? (f = document.createElement(a), f.width = c.width, f.height = c.height, g = f.getContext(b), g.putImageData(c, 0, 0), h = f.toDataURL(), e = new Image, e.onload = function() {
				d(e)
			}, e.src = h) : d(null) : d(null)
		},
		_rgbToHex: function(a, b, c) {
			return ((1 << 24) + (a << 16) + (b << 8) + c).toString(16).slice(1)
		},
		_hexToRgb: function(a) {
			a = a.replace(h, i);
			var b = parseInt(a, 16);
			return {
				r: b >> 16 & 255,
				g: b >> 8 & 255,
				b: b & 255
			}
		},
		getRandomColor: function() {
			var a = (Math.random() * 16777215 << 0).toString(16);
			while (a.length < 6) a = j + a;
			return h + a
		},
		getRGB: function(a) {
			var b;
			return a in m ? (b = m[a], {
				r: b[0],
				g: b[1],
				b: b[2]
			}) : a[0] === h ? this._hexToRgb(a.substring(1)) : a.substr(0, 4) === l ? (b = n.exec(a.replace(/ /g, "")), {
				r: parseInt(b[1]),
				g: parseInt(b[2]),
				b: parseInt(b[3])
			}) : {
				r: 0,
				g: 0,
				b: 0
			}
		},
		_merge: function(a, b) {
			var c = this._clone(b);
			for (var d in a) this._isObject(a[d]) ? c[d] = this._merge(a[d], c[d]) : c[d] = a[d];
			return c
		},
		_clone: function(a) {
			var b = {};
			for (var c in a) this._isObject(a[c]) ? b[c] = this._clone(a[c]) : b[c] = a[c];
			return b
		},
		_degToRad: function(a) {
			return a * f
		},
		_radToDeg: function(a) {
			return a * g
		},
		_capitalize: function(a) {
			return a.charAt(0).toUpperCase() + a.slice(1)
		},
		warn: function(a) {
			window.console && console.warn && console.warn(k + a)
		},
		extend: function(a, b) {
			for (var c in b.prototype) c in a.prototype || (a.prototype[c] = b.prototype[c])
		},
		addMethods: function(a, b) {
			var c;
			for (c in b) a.prototype[c] = b[c]
		}
	}
}(),
function() {
	var a = document.createElement("canvas"),
		b = a.getContext("2d"),
		c = window.devicePixelRatio || 1,
		d = b.webkitBackingStorePixelRatio || b.mozBackingStorePixelRatio || b.msBackingStorePixelRatio || b.oBackingStorePixelRatio || b.backingStorePixelRatio || 1,
		e = c / d;
	Kinetic.Canvas = function(a) {
		this.init(a)
	}, Kinetic.Canvas.prototype = {
		init: function(a) {
			var a = a || {},
				b = a.width || 0,
				c = a.height || 0,
				d = a.pixelRatio || e,
				f = a.contextType || "2d";
			this.pixelRatio = d, this.element = document.createElement("canvas"), this.element.style.padding = 0, this.element.style.margin = 0, this.element.style.border = 0, this.element.style.background = "transparent", this.context = this.element.getContext(f), this.setSize(b, c)
		},
		getElement: function() {
			return this.element
		},
		getContext: function() {
			return this.context
		},
		setWidth: function(a) {
			this.width = this.element.width = a * this.pixelRatio, this.element.style.width = a + "px"
		},
		setHeight: function(a) {
			this.height = this.element.height = a * this.pixelRatio, this.element.style.height = a + "px"
		},
		getWidth: function() {
			return this.width
		},
		getHeight: function() {
			return this.height
		},
		setSize: function(a, b) {
			this.setWidth(a), this.setHeight(b)
		},
		clear: function() {
			var a = this.getContext(),
				b = this.getElement();
			a.clearRect(0, 0, this.getWidth(), this.getHeight())
		},
		toDataURL: function(a, b) {
			try {
				return this.element.toDataURL(a, b)
			} catch (c) {
				try {
					return this.element.toDataURL()
				} catch (c) {
					return Kinetic.Util.warn("Unable to get data URL. " + c.message), ""
				}
			}
		},
		fill: function(a) {
			a.getFillEnabled() && this._fill(a)
		},
		stroke: function(a) {
			a.getStrokeEnabled() && this._stroke(a)
		},
		fillStroke: function(a) {
			var b = a.getFillEnabled();
			b && this._fill(a), a.getStrokeEnabled() && this._stroke(a, a.hasShadow() && a.hasFill() && b)
		},
		applyShadow: function(a, b) {
			var c = this.context;
			c.save(), this._applyShadow(a), b(), c.restore(), b()
		},
		_applyLineCap: function(a) {
			var b = a.getLineCap();
			b && (this.context.lineCap = b)
		},
		_applyOpacity: function(a) {
			var b = a.getAbsoluteOpacity();
			b !== 1 && (this.context.globalAlpha = b)
		},
		_applyLineJoin: function(a) {
			var b = a.getLineJoin();
			b && (this.context.lineJoin = b)
		},
		_applyAncestorTransforms: function(a) {
			var b = this.context,
				c, d;
			a._eachAncestorReverse(function(a) {
				c = a.getTransform(!0), d = c.getMatrix(), b.transform(d[0], d[1], d[2], d[3], d[4], d[5])
			}, !0)
		},
		_clip: function(a) {
			var b = this.getContext();
			b.save(), this._applyAncestorTransforms(a), b.beginPath(), a.getClipFunc()(this), b.clip(), b.setTransform(1, 0, 0, 1, 0, 0)
		}
	}, Kinetic.SceneCanvas = function(a) {
		Kinetic.Canvas.call(this, a)
	}, Kinetic.SceneCanvas.prototype = {
		setWidth: function(a) {
			var b = this.pixelRatio;
			Kinetic.Canvas.prototype.setWidth.call(this, a), this.context.scale(b, b)
		},
		setHeight: function(a) {
			var b = this.pixelRatio;
			Kinetic.Canvas.prototype.setHeight.call(this, a), this.context.scale(b, b)
		},
		_fillColor: function(a) {
			var b = this.context,
				c = a.getFill();
			b.fillStyle = c, a._fillFunc(b)
		},
		_fillPattern: function(a) {
			var b = this.context,
				c = a.getFillPatternImage(),
				d = a.getFillPatternX(),
				e = a.getFillPatternY(),
				f = a.getFillPatternScale(),
				g = a.getFillPatternRotation(),
				h = a.getFillPatternOffset(),
				i = a.getFillPatternRepeat();
			(d || e) && b.translate(d || 0, e || 0), g && b.rotate(g), f && b.scale(f.x, f.y), h && b.translate(-1 * h.x, -1 * h.y), b.fillStyle = b.createPattern(c, i || "repeat"), b.fill()
		},
		_fillLinearGradient: function(a) {
			var b = this.context,
				c = a.getFillLinearGradientStartPoint(),
				d = a.getFillLinearGradientEndPoint(),
				e = a.getFillLinearGradientColorStops(),
				f = b.createLinearGradient(c.x, c.y, d.x, d.y);
			if (e) {
				for (var g = 0; g < e.length; g += 2) f.addColorStop(e[g], e[g + 1]);
				b.fillStyle = f, b.fill()
			}
		},
		_fillRadialGradient: function(a) {
			var b = this.context,
				c = a.getFillRadialGradientStartPoint(),
				d = a.getFillRadialGradientEndPoint(),
				e = a.getFillRadialGradientStartRadius(),
				f = a.getFillRadialGradientEndRadius(),
				g = a.getFillRadialGradientColorStops(),
				h = b.createRadialGradient(c.x, c.y, e, d.x, d.y, f);
			for (var i = 0; i < g.length; i += 2) h.addColorStop(g[i], g[i + 1]);
			b.fillStyle = h, b.fill()
		},
		_fill: function(a, b) {
			var c = this.context,
				d = a.getFill(),
				e = a.getFillPatternImage(),
				f = a.getFillLinearGradientColorStops(),
				g = a.getFillRadialGradientColorStops(),
				h = a.getFillPriority();
			c.save(), !b && a.hasShadow() && this._applyShadow(a), d && h === "color" ? this._fillColor(a) : e && h === "pattern" ? this._fillPattern(a) : f && h === "linear-gradient" ? this._fillLinearGradient(a) : g && h === "radial-gradient" ? this._fillRadialGradient(a) : d ? this._fillColor(a) : e ? this._fillPattern(a) : f ? this._fillLinearGradient(a) : g && this._fillRadialGradient(a), c.restore(), !b && a.hasShadow() && this._fill(a, !0)
		},
		_stroke: function(a, b) {
			var c = this.context,
				d = a.getStroke(),
				e = a.getStrokeWidth(),
				f = a.getDashArray();
			if (d || e) c.save(), a.getStrokeScaleEnabled() || c.setTransform(1, 0, 0, 1, 0, 0), this._applyLineCap(a), f && a.getDashArrayEnabled() && (c.setLineDash ? c.setLineDash(f) : "mozDash" in c ? c.mozDash = f : "webkitLineDash" in c && (c.webkitLineDash = f)), !b && a.hasShadow() && this._applyShadow(a), c.lineWidth = e || 2, c.strokeStyle = d || "black", a._strokeFunc(c), c.restore(), !b && a.hasShadow() && this._stroke(a, !0)
		},
		_applyShadow: function(a) {
			var b = this.context;
			if (a.hasShadow() && a.getShadowEnabled()) {
				var c = a.getAbsoluteOpacity(),
					d = a.getShadowColor() || "black",
					e = a.getShadowBlur() || 5,
					f = a.getShadowOffset() || {
						x: 0,
						y: 0
					};
				a.getShadowOpacity() && (b.globalAlpha = a.getShadowOpacity() * c), b.shadowColor = d, b.shadowBlur = e, b.shadowOffsetX = f.x, b.shadowOffsetY = f.y
			}
		}
	}, Kinetic.Util.extend(Kinetic.SceneCanvas, Kinetic.Canvas), Kinetic.HitCanvas = function(a) {
		Kinetic.Canvas.call(this, a)
	}, Kinetic.HitCanvas.prototype = {
		_fill: function(a) {
			var b = this.context;
			b.save(), b.fillStyle = a.colorKey, a._fillFuncHit(b), b.restore()
		},
		_stroke: function(a) {
			var b = this.context,
				c = a.getStroke(),
				d = a.getStrokeWidth();
			if (c || d) this._applyLineCap(a), b.save(), b.lineWidth = d || 2, b.strokeStyle = a.colorKey, a._strokeFuncHit(b), b.restore()
		}
	}, Kinetic.Util.extend(Kinetic.HitCanvas, Kinetic.Canvas)
}(),
function() {
	var a = " ",
		b = "",
		c = ".",
		d = "get",
		e = "set",
		f = "Shape",
		g = "Stage",
		h = "x",
		i = "y",
		j = "X",
		k = "Y",
		l = "kinetic",
		m = "before",
		n = "Change",
		o = "id",
		p = "name",
		q = "mouseenter",
		r = "mouseleave",
		s = "Deg",
		t = "on",
		u = "off",
		v = "beforeDraw",
		w = "draw",
		x = "black",
		y = "RGB",
		z = "r",
		A = "g",
		B = "b",
		C = "R",
		D = "G",
		E = "B",
		F = "#",
		G = "children";
	Kinetic.Util.addMethods(Kinetic.Node, {
		_nodeInit: function(a) {
			this._id = Kinetic.Global.idCounter++, this.eventListeners = {}, this.setAttrs(a)
		},
		on: function(d, e) {
			var f = d.split(a),
				g = f.length,
				h, i, j, k, l, m;
			for (h = 0; h < g; h++) i = f[h], j = i, k = j.split(c), l = k[0], m = k.length > 1 ? k[1] : b, this.eventListeners[l] || (this.eventListeners[l] = []), this.eventListeners[l].push({
				name: m,
				handler: e
			});
			return this
		},
		off: function(b) {
			var d = b.split(a),
				e = d.length,
				f, g, h, i, j;
			for (f = 0; f < e; f++) {
				g = d[f], h = g, i = h.split(c), j = i[0];
				if (i.length > 1)
					if (j) this.eventListeners[j] && this._off(j, i[1]);
					else
						for (var g in this.eventListeners) this._off(g, i[1]);
				else delete this.eventListeners[j]
			}
			return this
		},
		remove: function() {
			var a = this.getParent();
			a && a.children && (a.children.splice(this.index, 1), a._setChildrenIndices()), delete this.parent
		},
		destroy: function() {
			var a = this.getParent(),
				b = this.getStage(),
				c = Kinetic.DD,
				d = Kinetic.Global;
			while (this.children && this.children.length > 0) this.children[0].destroy();
			d._removeId(this.getId()), d._removeName(this.getName(), this._id), this.remove()
		},
		getAttr: function(a) {
			var b = d + Kinetic.Util._capitalize(a);
			return Kinetic.Util._isFunction(this[b]) ? this[b]() : this.attrs[a]
		},
		setAttr: function() {
			var a = Array.prototype.slice.call(arguments),
				b = a[0],
				c = e + Kinetic.Util._capitalize(b),
				d = this[c];
			a.shift(), Kinetic.Util._isFunction(d) ? d.apply(this, a) : this.attrs[b] = a[0]
		},
		getAttrs: function() {
			return this.attrs || {}
		},
		createAttrs: function() {
			this.attrs === undefined && (this.attrs = {})
		},
		setAttrs: function(a) {
			var b, c;
			if (a)
				for (b in a) b !== G && (c = e + Kinetic.Util._capitalize(b), Kinetic.Util._isFunction(this[c]) ? this[c](a[b]) : this._setAttr(b, a[b]))
		},
		getVisible: function() {
			var a = this.attrs.visible,
				b = this.getParent();
			return a === undefined && (a = !0), a && b && !b.getVisible() ? !1 : a
		},
		getListening: function() {
			var a = this.attrs.listening,
				b = this.getParent();
			return a === undefined && (a = !0), a && b && !b.getListening() ? !1 : a
		},
		show: function() {
			this.setVisible(!0)
		},
		hide: function() {
			this.setVisible(!1)
		},
		getZIndex: function() {
			return this.index || 0
		},
		getAbsoluteZIndex: function() {
			function k(b) {
				e = [], h = b.length;
				for (i = 0; i < h; i++) j = b[i], d++, j.nodeType !== f && (e = e.concat(j.getChildren().toArray())), j._id === c._id && (i = h);
				e.length > 0 && e[0].getLevel() <= a && k(e)
			}
			var a = this.getLevel(),
				b = this.getStage(),
				c = this,
				d = 0,
				e, h, i, j;
			return c.nodeType !== g && k(c.getStage().getChildren()), d
		},
		getLevel: function() {
			var a = 0,
				b = this.parent;
			while (b) a++, b = b.parent;
			return a
		},
		setPosition: function() {
			var a = Kinetic.Util._getXY([].slice.call(arguments));
			this.setX(a.x), this.setY(a.y)
		},
		getPosition: function() {
			return {
				x: this.getX(),
				y: this.getY()
			}
		},
		getAbsolutePosition: function() {
			var a = this.getAbsoluteTransform(),
				b = this.getOffset();
			return a.translate(b.x, b.y), a.getTranslation()
		},
		setAbsolutePosition: function() {
			var a = Kinetic.Util._getXY([].slice.call(arguments)),
				b = this._clearTransform(),
				c;
			this.attrs.x = b.x, this.attrs.y = b.y, delete b.x, delete b.y, c = this.getAbsoluteTransform(), c.invert(), c.translate(a.x, a.y), a = {
				x: this.attrs.x + c.getTranslation().x,
				y: this.attrs.y + c.getTranslation().y
			}, this.setPosition(a.x, a.y), this._setTransform(b)
		},
		move: function() {
			var a = Kinetic.Util._getXY([].slice.call(arguments)),
				b = this.getX(),
				c = this.getY();
			a.x !== undefined && (b += a.x), a.y !== undefined && (c += a.y), this.setPosition(b, c)
		},
		_eachAncestorReverse: function(a, b) {
			var c = [],
				d = this.getParent(),
				e, f;
			b && c.unshift(this);
			while (d) c.unshift(d), d = d.parent;
			e = c.length;
			for (f = 0; f < e; f++) a(c[f])
		},
		rotate: function(a) {
			this.setRotation(this.getRotation() + a)
		},
		rotateDeg: function(a) {
			this.setRotation(this.getRotation() + Kinetic.Util._degToRad(a))
		},
		moveToTop: function() {
			var a = this.index;
			return this.parent.children.splice(a, 1), this.parent.children.push(this), this.parent._setChildrenIndices(), !0
		},
		moveUp: function() {
			var a = this.index,
				b = this.parent.getChildren().length;
			if (a < b - 1) return this.parent.children.splice(a, 1), this.parent.children.splice(a + 1, 0, this), this.parent._setChildrenIndices(), !0
		},
		moveDown: function() {
			var a = this.index;
			if (a > 0) return this.parent.children.splice(a, 1), this.parent.children.splice(a - 1, 0, this), this.parent._setChildrenIndices(), !0
		},
		moveToBottom: function() {
			var a = this.index;
			if (a > 0) return this.parent.children.splice(a, 1), this.parent.children.unshift(this), this.parent._setChildrenIndices(), !0
		},
		setZIndex: function(a) {
			var b = this.index;
			this.parent.children.splice(b, 1), this.parent.children.splice(a, 0, this), this.parent._setChildrenIndices()
		},
		getAbsoluteOpacity: function() {
			var a = this.getOpacity();
			return this.getParent() && (a *= this.getParent().getAbsoluteOpacity()), a
		},
		moveTo: function(a) {
			Kinetic.Node.prototype.remove.call(this), a.add(this)
		},
		toObject: function() {
			var a = Kinetic.Util,
				b = {},
				c = this.getAttrs(),
				d, e;
			b.attrs = {};
			for (d in c) e = c[d], !a._isFunction(e) && !a._isElement(e) && (!a._isObject(e) || !a._hasMethods(e)) && (b.attrs[d] = e);
			return b.className = this.getClassName(), b
		},
		toJSON: function() {
			return JSON.stringify(this.toObject())
		},
		getParent: function() {
			return this.parent
		},
		getLayer: function() {
			return this.getParent().getLayer()
		},
		getStage: function() {
			return this.getParent() ? this.getParent().getStage() : undefined
		},
		fire: function(a, b, c) {
			c ? this._fireAndBubble(a, b || {}) : this._fire(a, b || {})
		},
		getAbsoluteTransform: function() {
			var a = new Kinetic.Transform,
				b;
			return this._eachAncestorReverse(function(c) {
				b = c.getTransform(), a.multiply(b)
			}, !0), a
		},
		_getAndCacheTransform: function() {
			var a = new Kinetic.Transform,
				b = this.getX(),
				c = this.getY(),
				d = this.getRotation(),
				e = this.getScaleX(),
				f = this.getScaleY(),
				g = this.getSkewX(),
				h = this.getSkewY(),
				i = this.getOffsetX(),
				j = this.getOffsetY();
			return (b !== 0 || c !== 0) && a.translate(b, c), d !== 0 && a.rotate(d), (g !== 0 || h !== 0) && a.skew(g, h), (e !== 1 || f !== 1) && a.scale(e, f), (i !== 0 || j !== 0) && a.translate(-1 * i, -1 * j), this.cachedTransform = a, a
		},
		getTransform: function(a) {
			var b = this.cachedTransform;
			return a && b ? b : this._getAndCacheTransform()
		},
		clone: function(a) {
			var b = this.getClassName(),
				c = new Kinetic[b](this.attrs),
				d, e, f, g, h;
			for (d in this.eventListeners) {
				e = this.eventListeners[d], f = e.length;
				for (g = 0; g < f; g++) h = e[g], h.name.indexOf(l) < 0 && (c.eventListeners[d] || (c.eventListeners[d] = []), c.eventListeners[d].push(h))
			}
			return c.setAttrs(a), c
		},
		toDataURL: function(a) {
			var a = a || {},
				b = a.mimeType || null,
				c = a.quality || null,
				d = this.getStage(),
				e = a.x || 0,
				f = a.y || 0,
				g = new Kinetic.SceneCanvas({
					width: a.width || d.getWidth(),
					height: a.height || d.getHeight(),
					pixelRatio: 1
				}),
				h = g.getContext();
			return h.save(), (e || f) && h.translate(-1 * e, -1 * f), this.drawScene(g), h.restore(), g.toDataURL(b, c)
		},
		toImage: function(a) {
			Kinetic.Util._getImage(this.toDataURL(a), function(b) {
				a.callback(b)
			})
		},
		setSize: function() {
			var a = Kinetic.Util._getSize(Array.prototype.slice.call(arguments));
			this.setWidth(a.width), this.setHeight(a.height)
		},
		getSize: function() {
			return {
				width: this.getWidth(),
				height: this.getHeight()
			}
		},
		getWidth: function() {
			return this.attrs.width || 0
		},
		getHeight: function() {
			return this.attrs.height || 0
		},
		getClassName: function() {
			return this.className || this.nodeType
		},
		getType: function() {
			return this.nodeType
		},
		_get: function(a) {
			return this.nodeType === a ? [this] : []
		},
		_off: function(a, b) {
			var c = this.eventListeners[a],
				d;
			for (d = 0; d < c.length; d++)
				if (c[d].name === b) {
					c.splice(d, 1);
					if (c.length === 0) {
						delete this.eventListeners[a];
						break
					}
					d--
				}
		},
		_clearTransform: function() {
			var a = {
				x: this.getX(),
				y: this.getY(),
				rotation: this.getRotation(),
				scaleX: this.getScaleX(),
				scaleY: this.getScaleY(),
				offsetX: this.getOffsetX(),
				offsetY: this.getOffsetY(),
				skewX: this.getSkewX(),
				skewY: this.getSkewY()
			};
			return this.attrs.x = 0, this.attrs.y = 0, this.attrs.rotation = 0, this.attrs.scaleX = 1, this.attrs.scaleY = 1, this.attrs.offsetX = 0, this.attrs.offsetY = 0, this.attrs.skewX = 0, this.attrs.skewY = 0, a
		},
		_setTransform: function(a) {
			var b;
			for (b in a) this.attrs[b] = a[b];
			this.cachedTransform = null
		},
		_fireBeforeChangeEvent: function(a, b, c) {
			this._fire(m + Kinetic.Util._capitalize(a) + n, {
				oldVal: b,
				newVal: c
			})
		},
		_fireChangeEvent: function(a, b, c) {
			this._fire(a + n, {
				oldVal: b,
				newVal: c
			})
		},
		setId: function(a) {
			var b = this.getId(),
				c = this.getStage(),
				d = Kinetic.Global;
			d._removeId(b), d._addId(this, a), this._setAttr(o, a)
		},
		setName: function(a) {
			var b = this.getName(),
				c = this.getStage(),
				d = Kinetic.Global;
			d._removeName(b, this._id), d._addName(this, a), this._setAttr(p, a)
		},
		_setAttr: function(a, b) {
			var c;
			b !== undefined && (c = this.attrs[a], this._fireBeforeChangeEvent(a, c, b), this.attrs[a] = b, this._fireChangeEvent(a, c, b))
		},
		_fireAndBubble: function(a, b, c) {
			b && this.nodeType === f && (b.targetNode = this);
			var d = this.getStage(),
				e = this.eventListeners,
				g = !0;
			a === q && c && this._id === c._id ? g = !1 : a === r && c && this._id === c._id && (g = !1), g && (this._fire(a, b), b && !b.cancelBubble && this.parent && (c && c.parent ? this._fireAndBubble.call(this.parent, a, b, c.parent) : this._fireAndBubble.call(this.parent, a, b)))
		},
		_fire: function(a, b) {
			var c = this.eventListeners[a],
				d, e;
			if (c) {
				d = c.length;
				for (e = 0; e < d; e++) c[e].handler.call(this, b)
			}
		},
		draw: function() {
			var a = {
				node: this
			};
			this._fire(v, a), this.drawScene(), this.drawHit(), this._fire(w, a)
		},
		shouldDrawHit: function() {
			return this.isVisible() && this.isListening() && !Kinetic.Global.isDragging()
		},
		isDraggable: function() {
			return !1
		}
	}), Kinetic.Node.addGetterSetter = function(a, b, c, d) {
		this.addGetter(a, b, c), this.addSetter(a, b, d)
	}, Kinetic.Node.addPointGetterSetter = function(a, b, c, d) {
		this.addPointGetter(a, b), this.addPointSetter(a, b), this.addGetter(a, b + j, c), this.addGetter(a, b + k, c), this.addSetter(a, b + j, d), this.addSetter(a, b + k, d)
	}, Kinetic.Node.addRotationGetterSetter = function(a, b, c, d) {
		this.addRotationGetter(a, b, c), this.addRotationSetter(a, b, d)
	}, Kinetic.Node.addColorGetterSetter = function(a, b) {
		this.addGetter(a, b), this.addSetter(a, b), this.addColorRGBGetter(a, b), this.addColorComponentGetter(a, b, z), this.addColorComponentGetter(a, b, A), this.addColorComponentGetter(a, b, B), this.addColorRGBSetter(a, b), this.addColorComponentSetter(a, b, z), this.addColorComponentSetter(a, b, A), this.addColorComponentSetter(a, b, B)
	}, Kinetic.Node.addColorRGBGetter = function(a, b) {
		var c = d + Kinetic.Util._capitalize(b) + y;
		a.prototype[c] = function() {
			return Kinetic.Util.getRGB(this.attrs[b])
		}
	}, Kinetic.Node.addColorRGBSetter = function(a, b) {
		var c = e + Kinetic.Util._capitalize(b) + y;
		a.prototype[c] = function(a) {
			var c = a && a.r !== undefined ? a.r | 0 : this.getAttr(b + C),
				d = a && a.g !== undefined ? a.g | 0 : this.getAttr(b + D),
				e = a && a.b !== undefined ? a.b | 0 : this.getAttr(b + E);
			this._setAttr(b, F + Kinetic.Util._rgbToHex(c, d, e))
		}
	}, Kinetic.Node.addColorComponentGetter = function(a, b, c) {
		var e = d + Kinetic.Util._capitalize(b),
			f = e + Kinetic.Util._capitalize(c);
		a.prototype[f] = function() {
			return this[e + y]()[c]
		}
	}, Kinetic.Node.addColorComponentSetter = function(a, b, c) {
		var d = e + Kinetic.Util._capitalize(b),
			f = d + Kinetic.Util._capitalize(c);
		a.prototype[f] = function(a) {
			var b = {};
			b[c] = a, this[d + y](b)
		}
	}, Kinetic.Node.addSetter = function(a, b, c) {
		var d = this,
			f = e + Kinetic.Util._capitalize(b);
		a.prototype[f] = function(a) {
			this._setAttr(b, a), c && (this.cachedTransform = null)
		}
	}, Kinetic.Node.addPointSetter = function(a, b) {
		var c = this,
			d = e + Kinetic.Util._capitalize(b);
		a.prototype[d] = function() {
			var a = Kinetic.Util._getXY([].slice.call(arguments)),
				c = this.attrs[b],
				e = 0,
				f = 0;
			a && (e = a.x, f = a.y, this._fireBeforeChangeEvent(b, c, a), e !== undefined && this[d + j](e), f !== undefined && this[d + k](f), this._fireChangeEvent(b, c, a))
		}
	}, Kinetic.Node.addRotationSetter = function(a, b, c) {
		var d = this,
			f = e + Kinetic.Util._capitalize(b);
		a.prototype[f] = function(a) {
			this._setAttr(b, a), c && (this.cachedTransform = null)
		}, a.prototype[f + s] = function(a) {
			this._setAttr(b, Kinetic.Util._degToRad(a)), c && (this.cachedTransform = null)
		}
	}, Kinetic.Node.addGetter = function(a, b, c) {
		var e = this,
			f = d + Kinetic.Util._capitalize(b);
		a.prototype[f] = function(a) {
			var d = this.attrs[b];
			return d === undefined && (d = c), d
		}
	}, Kinetic.Node.addPointGetter = function(a, b) {
		var c = this,
			e = d + Kinetic.Util._capitalize(b);
		a.prototype[e] = function(a) {
			var b = this;
			return {
				x: b[e + j](),
				y: b[e + k]()
			}
		}
	}, Kinetic.Node.addRotationGetter = function(a, b, c) {
		var e = this,
			f = d + Kinetic.Util._capitalize(b);
		a.prototype[f] = function() {
			var a = this.attrs[b];
			return a === undefined && (a = c), a
		}, a.prototype[f + s] = function() {
			var a = this.attrs[b];
			return a === undefined && (a = c), Kinetic.Util._radToDeg(a)
		}
	}, Kinetic.Node.create = function(a, b) {
		return this._createNode(JSON.parse(a), b)
	}, Kinetic.Node._createNode = function(a, b) {
		var c = Kinetic.Node.prototype.getClassName.call(a),
			d = a.children,
			e, f, g;
		b && (a.attrs.container = b), e = new Kinetic[c](a.attrs);
		if (d) {
			f = d.length;
			for (g = 0; g < f; g++) e.add(this._createNode(d[g]))
		}
		return e
	}, Kinetic.Node.addGetterSetter(Kinetic.Node, "x", 0, !0), Kinetic.Node.addGetterSetter(Kinetic.Node, "y", 0, !0), Kinetic.Node.addGetterSetter(Kinetic.Node, "opacity", 1), Kinetic.Node.addGetter(Kinetic.Node, "name"), Kinetic.Node.addGetter(Kinetic.Node, "id"), Kinetic.Node.addRotationGetterSetter(Kinetic.Node, "rotation", 0, !0), Kinetic.Node.addPointGetterSetter(Kinetic.Node, "scale", 1, !0), Kinetic.Node.addPointGetterSetter(Kinetic.Node, "skew", 0, !0), Kinetic.Node.addPointGetterSetter(Kinetic.Node, "offset", 0, !0), Kinetic.Node.addSetter(Kinetic.Node, "width"), Kinetic.Node.addSetter(Kinetic.Node, "height"), Kinetic.Node.addSetter(Kinetic.Node, "listening"), Kinetic.Node.addSetter(Kinetic.Node, "visible"), Kinetic.Node.prototype.isListening = Kinetic.Node.prototype.getListening, Kinetic.Node.prototype.isVisible = Kinetic.Node.prototype.getVisible, Kinetic.Collection.mapMethods(["on", "off", "draw"])
}(),
function() {
	function a(a) {
		window.setTimeout(a, 1e3 / 60)
	}
	Kinetic.Animation = function(a, b) {
		this.func = a, this.setLayers(b), this.id = Kinetic.Animation.animIdCounter++, this.frame = {
			time: 0,
			timeDiff: 0,
			lastTime: (new Date).getTime()
		}
	}, Kinetic.Animation.prototype = {
		setLayers: function(a) {
			var b = [];
			a ? a.length > 0 ? b = a : b = [a] : b = [], this.layers = b
		},
		getLayers: function() {
			return this.layers
		},
		addLayer: function(a) {
			var b = this.layers,
				c, d;
			if (b) {
				c = b.length;
				for (d = 0; d < c; d++)
					if (b[d]._id === a._id) return !1
			} else this.layers = [];
			return this.layers.push(a), !0
		},
		isRunning: function() {
			var a = Kinetic.Animation,
				b = a.animations;
			for (var c = 0; c < b.length; c++)
				if (b[c].id === this.id) return !0;
			return !1
		},
		start: function() {
			this.stop(), this.frame.timeDiff = 0, this.frame.lastTime = (new Date).getTime(), Kinetic.Animation._addAnimation(this)
		},
		stop: function() {
			Kinetic.Animation._removeAnimation(this)
		},
		_updateFrameObject: function(a) {
			this.frame.timeDiff = a - this.frame.lastTime, this.frame.lastTime = a, this.frame.time += this.frame.timeDiff, this.frame.frameRate = 1e3 / this.frame.timeDiff
		}
	}, Kinetic.Animation.animations = [], Kinetic.Animation.animIdCounter = 0, Kinetic.Animation.animRunning = !1, Kinetic.Animation._addAnimation = function(a) {
		this.animations.push(a), this._handleAnimation()
	}, Kinetic.Animation._removeAnimation = function(a) {
		var b = a.id,
			c = this.animations,
			d = c.length;
		for (var e = 0; e < d; e++)
			if (c[e].id === b) {
				this.animations.splice(e, 1);
				break
			}
	}, Kinetic.Animation._runFrames = function() {
		var a = {},
			b = this.animations,
			c, d, e, f, g, h, i, j;
		for (f = 0; f < b.length; f++) {
			c = b[f], d = c.layers, e = c.func, c._updateFrameObject((new Date).getTime()), h = d.length;
			for (g = 0; g < h; g++) i = d[g], i._id !== undefined && (a[i._id] = i);
			e && e.call(c, c.frame)
		}
		for (j in a) a[j].draw()
	}, Kinetic.Animation._animationLoop = function() {
		var a = this;
		this.animations.length > 0 ? (this._runFrames(), Kinetic.Animation.requestAnimFrame(function() {
			a._animationLoop()
		})) : this.animRunning = !1
	}, Kinetic.Animation._handleAnimation = function() {
		var a = this;
		this.animRunning || (this.animRunning = !0, a._animationLoop())
	}, RAF = function() {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || a
	}(), Kinetic.Animation.requestAnimFrame = function(b) {
		var c = Kinetic.DD && Kinetic.DD.isDragging ? a : RAF;
		c(b)
	};
	var b = Kinetic.Node.prototype.moveTo;
	Kinetic.Node.prototype.moveTo = function(a) {
		b.call(this, a)
	}, Kinetic.Layer.batchAnim = new Kinetic.Animation(function() {
		this.getLayers().length === 0 && this.stop(), this.setLayers([])
	}), Kinetic.Layer.prototype.batchDraw = function() {
		var a = Kinetic.Layer.batchAnim;
		a.addLayer(this), a.isRunning() || a.start()
	}
}(),
function() {
	function e(a, b, c, d, e, g) {
		var h = "set" + Kinetic.Util._capitalize(b);
		return new f(b, function(b) {
			a[h](b)
		}, c, a["get" + Kinetic.Util._capitalize(b)](), d, e * 1e3, g)
	}
	var a = {
			node: 1,
			duration: 1,
			easing: 1,
			onFinish: 1,
			yoyo: 1
		},
		b = 1,
		c = 2,
		d = 3;
	Kinetic.Tween = function(b) {
		var c = this,
			d = b.node,
			f = d._id,
			g = b.duration || 1,
			h = b.easing || Kinetic.Easings.Linear,
			i = !!b.yoyo,
			j, k;
		this.tweens = [], this.node = d, this.onFinish = b.onFinish, this.anim = new Kinetic.Animation(function() {
			c._onEnterFrame()
		}, d.getLayer() || d.getLayers());
		for (j in b) a[j] === undefined && (k = e(d, j, h, b[j], g, i), this.tweens.push(k), this._addListeners(k), Kinetic.Tween.add(f, j, this));
		this.reset()
	}, Kinetic.Tween.tweens = {}, Kinetic.Tween.add = function(a, b, c) {
		var d = a + "-" + b,
			e = Kinetic.Tween.tweens[d];
		e && e._removeTween(b), Kinetic.Tween.tweens[d] = c
	}, Kinetic.Tween.prototype = {
		_iterate: function(a) {
			var b = this.tweens,
				c = 0,
				d = b[c];
			while (d) a(d, c++), d = b[c]
		},
		_isLastTween: function(a) {
			var b = this.tweens,
				c = b.length,
				d;
			return b[c - 1].prop === a.prop
		},
		_addListeners: function(a) {
			var b = this;
			a.onPlay = function() {
				b._isLastTween(a) && b.anim.start()
			}, a.onReverse = function() {
				b._isLastTween(a) && b.anim.start()
			}, a.onPause = function() {
				b._isLastTween(a) && b.anim.stop()
			}, a.onFinish = function() {
				b._isLastTween(a) && b.onFinish && b.onFinish()
			}
		},
		play: function() {
			this._iterate(function(a) {
				a.play()
			})
		},
		reverse: function() {
			this._iterate(function(a) {
				a.reverse()
			})
		},
		reset: function() {
			var a = this.node;
			this._iterate(function(a) {
				a.reset()
			}), (a.getLayer() || a.getLayers()).draw()
		},
		seek: function(a) {
			var b = this.node;
			this._iterate(function(b) {
				b.seek(a * 1e3)
			}), (b.getLayer() || b.getLayers()).draw()
		},
		pause: function() {
			this._iterate(function(a) {
				a.pause()
			})
		},
		finish: function() {
			var a = this.node;
			this._iterate(function(a) {
				a.finish()
			}), (a.getLayer() || a.getLayers()).draw()
		},
		_onEnterFrame: function() {
			this._iterate(function(a) {
				a.onEnterFrame()
			})
		},
		destroy: function() {},
		_removeTween: function(a) {
			var b = this;
			this._iterate(function(c, d) {
				c.prop === a && b.tweens.splice(d, 1)
			})
		}
	};
	var f = function(a, b, c, d, e, f, g) {
		this.prop = a, this.propFunc = b, this.begin = d, this._pos = d, this.duration = f, this._change = 0, this.prevPos = 0, this.yoyo = g, this._time = 0, this._position = 0, this._startTime = 0, this._finish = 0, this.func = c, this._change = e - this.begin, this.pause()
	};
	f.prototype = {
		fire: function(a) {
			var b = this[a];
			b && b()
		},
		setTime: function(a) {
			a > this.duration ? this.yoyo ? (this._time = this.duration, this.reverse()) : this.finish() : a < 0 ? this.yoyo ? (this._time = 0, this.play()) : this.reset() : (this._time = a, this.update())
		},
		getTime: function() {
			return this._time
		},
		setPosition: function(a) {
			this.prevPos = this._pos, this.propFunc(a), this._pos = a
		},
		getPosition: function(a) {
			return a === undefined && (a = this._time), this.func(a, this.begin, this._change, this.duration)
		},
		play: function() {
			this.state = c, this._startTime = this.getTimer() - this._time, this.onEnterFrame(), this.fire("onPlay")
		},
		reverse: function() {
			this.state = d, this._time = this.duration - this._time, this._startTime = this.getTimer() - this._time, this.onEnterFrame(), this.fire("onReverse")
		},
		seek: function(a) {
			this.pause(), this._time = a, this.update(), this.fire("onSeek")
		},
		reset: function() {
			this.pause(), this._time = 0, this.update(), this.fire("onReset")
		},
		finish: function() {
			this.pause(), this._time = this.duration, this.update(), this.fire("onFinish")
		},
		update: function() {
			this.setPosition(this.getPosition(this._time))
		},
		onEnterFrame: function() {
			var a = this.getTimer() - this._startTime;
			this.state === c ? this.setTime(a) : this.state === d && this.setTime(this.duration -
				a)
		},
		pause: function() {
			this.state = b, this.fire("onPause")
		},
		getTimer: function() {
			return (new Date).getTime()
		}
	}, Kinetic.Easings = {
		BackEaseIn: function(a, b, c, d, e, f) {
			var g = 1.70158;
			return c * (a /= d) * a * ((g + 1) * a - g) + b
		},
		BackEaseOut: function(a, b, c, d, e, f) {
			var g = 1.70158;
			return c * ((a = a / d - 1) * a * ((g + 1) * a + g) + 1) + b
		},
		BackEaseInOut: function(a, b, c, d, e, f) {
			var g = 1.70158;
			return (a /= d / 2) < 1 ? c / 2 * a * a * (((g *= 1.525) + 1) * a - g) + b : c / 2 * ((a -= 2) * a * (((g *= 1.525) + 1) * a + g) + 2) + b
		},
		ElasticEaseIn: function(a, b, c, d, e, f) {
			var g = 0;
			return a === 0 ? b : (a /= d) == 1 ? b + c : (f || (f = d * .3), !e || e < Math.abs(c) ? (e = c, g = f / 4) : g = f / (2 * Math.PI) * Math.asin(c / e), -(e * Math.pow(2, 10 * (a -= 1)) * Math.sin((a * d - g) * 2 * Math.PI / f)) + b)
		},
		ElasticEaseOut: function(a, b, c, d, e, f) {
			var g = 0;
			return a === 0 ? b : (a /= d) == 1 ? b + c : (f || (f = d * .3), !e || e < Math.abs(c) ? (e = c, g = f / 4) : g = f / (2 * Math.PI) * Math.asin(c / e), e * Math.pow(2, -10 * a) * Math.sin((a * d - g) * 2 * Math.PI / f) + c + b)
		},
		ElasticEaseInOut: function(a, b, c, d, e, f) {
			var g = 0;
			return a === 0 ? b : (a /= d / 2) == 2 ? b + c : (f || (f = d * .3 * 1.5), !e || e < Math.abs(c) ? (e = c, g = f / 4) : g = f / (2 * Math.PI) * Math.asin(c / e), a < 1 ? -0.5 * e * Math.pow(2, 10 * (a -= 1)) * Math.sin((a * d - g) * 2 * Math.PI / f) + b : e * Math.pow(2, -10 * (a -= 1)) * Math.sin((a * d - g) * 2 * Math.PI / f) * .5 + c + b)
		},
		BounceEaseOut: function(a, b, c, d) {
			return (a /= d) < 1 / 2.75 ? c * 7.5625 * a * a + b : a < 2 / 2.75 ? c * (7.5625 * (a -= 1.5 / 2.75) * a + .75) + b : a < 2.5 / 2.75 ? c * (7.5625 * (a -= 2.25 / 2.75) * a + .9375) + b : c * (7.5625 * (a -= 2.625 / 2.75) * a + .984375) + b
		},
		BounceEaseIn: function(a, b, c, d) {
			return c - Kinetic.Easings.BounceEaseOut(d - a, 0, c, d) + b
		},
		BounceEaseInOut: function(a, b, c, d) {
			return a < d / 2 ? Kinetic.Easings.BounceEaseIn(a * 2, 0, c, d) * .5 + b : Kinetic.Easings.BounceEaseOut(a * 2 - d, 0, c, d) * .5 + c * .5 + b
		},
		EaseIn: function(a, b, c, d) {
			return c * (a /= d) * a + b
		},
		EaseOut: function(a, b, c, d) {
			return -c * (a /= d) * (a - 2) + b
		},
		EaseInOut: function(a, b, c, d) {
			return (a /= d / 2) < 1 ? c / 2 * a * a + b : -c / 2 * (--a * (a - 2) - 1) + b
		},
		StrongEaseIn: function(a, b, c, d) {
			return c * (a /= d) * a * a * a * a + b
		},
		StrongEaseOut: function(a, b, c, d) {
			return c * ((a = a / d - 1) * a * a * a * a + 1) + b
		},
		StrongEaseInOut: function(a, b, c, d) {
			return (a /= d / 2) < 1 ? c / 2 * a * a * a * a * a + b : c / 2 * ((a -= 2) * a * a * a * a + 2) + b
		},
		Linear: function(a, b, c, d) {
			return c * a / d + b
		}
	}
}(),
function() {
	Kinetic.DD = {
		anim: new Kinetic.Animation,
		isDragging: !1,
		offset: {
			x: 0,
			y: 0
		},
		node: null,
		_drag: function(a) {
			var b = Kinetic.DD,
				c = b.node;
			if (c) {
				var d = c.getStage().getPointerPosition(),
					e = c.getDragBoundFunc(),
					f = {
						x: d.x - b.offset.x,
						y: d.y - b.offset.y
					};
				e !== undefined && (f = e.call(c, f, a)), c.setAbsolutePosition(f), b.isDragging || (b.isDragging = !0, c.fire("dragstart", a, !0)), c.fire("dragmove", a, !0)
			}
		},
		_endDragBefore: function(a) {
			var b = Kinetic.DD,
				c = b.node,
				d, e;
			c && (d = c.nodeType, e = c.getLayer(), b.anim.stop(), b.isDragging && (b.isDragging = !1, a && (a.dragEndNode = c)), delete b.node, (e || c).draw())
		},
		_endDragAfter: function(a) {
			var a = a || {},
				b = a.dragEndNode;
			a && b && b.fire("dragend", a, !0)
		}
	}, Kinetic.Node.prototype.startDrag = function() {
		var a = Kinetic.DD,
			b = this,
			c = this.getStage(),
			d = this.getLayer(),
			e = c.getPointerPosition(),
			f = this.getTransform().getTranslation(),
			g = this.getAbsolutePosition();
		e && (a.node && a.node.stopDrag(), a.node = this, a.offset.x = e.x - g.x, a.offset.y = e.y - g.y, a.anim.setLayers(d || this.getLayers()), a.anim.start())
	}, Kinetic.Node.prototype.stopDrag = function() {
		var a = Kinetic.DD,
			b = {};
		a._endDragBefore(b), a._endDragAfter(b)
	}, Kinetic.Node.prototype.setDraggable = function(a) {
		this._setAttr("draggable", a), this._dragChange()
	};
	var a = Kinetic.Node.prototype.destroy;
	Kinetic.Node.prototype.destroy = function() {
		var b = Kinetic.DD;
		b.node && b.node._id === this._id && this.stopDrag(), a.call(this)
	}, Kinetic.Node.prototype.isDragging = function() {
		var a = Kinetic.DD;
		return a.node && a.node._id === this._id && a.isDragging
	}, Kinetic.Node.prototype._listenDrag = function() {
		this._dragCleanup();
		var a = this;
		this.on("mousedown.kinetic touchstart.kinetic", function(b) {
			Kinetic.DD.node || a.startDrag(b)
		})
	}, Kinetic.Node.prototype._dragChange = function() {
		if (this.attrs.draggable) this._listenDrag();
		else {
			this._dragCleanup();
			var a = this.getStage(),
				b = Kinetic.DD;
			a && b.node && b.node._id === this._id && b.node.stopDrag()
		}
	}, Kinetic.Node.prototype._dragCleanup = function() {
		this.off("mousedown.kinetic"), this.off("touchstart.kinetic")
	}, Kinetic.Node.addGetterSetter(Kinetic.Node, "dragBoundFunc"), Kinetic.Node.addGetter(Kinetic.Node, "draggable", !1), Kinetic.Node.prototype.isDraggable = Kinetic.Node.prototype.getDraggable;
	var b = document.getElementsByTagName("html")[0];
	b.addEventListener("mouseup", Kinetic.DD._endDragBefore, !0), b.addEventListener("touchend", Kinetic.DD._endDragBefore, !0), b.addEventListener("mouseup", Kinetic.DD._endDragAfter, !1), b.addEventListener("touchend", Kinetic.DD._endDragAfter, !1)
}(),
function() {
	Kinetic.Util.addMethods(Kinetic.Container, {
		_containerInit: function(a) {
			this.children = new Kinetic.Collection, Kinetic.Node.call(this, a)
		},
		getChildren: function() {
			return this.children
		},
		removeChildren: function() {
			while (this.children.length > 0) this.children[0].remove()
		},
		add: function(a) {
			var b = Kinetic.Global,
				c = this.children;
			return a.index = c.length, a.parent = this, c.push(a), this._fire("add", {
				child: a
			}), this
		},
		get: function(a) {
			var b = new Kinetic.Collection;
			if (a.charAt(0) === "#") {
				var c = this._getNodeById(a.slice(1));
				c && b.push(c)
			} else if (a.charAt(0) === ".") {
				var d = this._getNodesByName(a.slice(1));
				Kinetic.Collection.apply(b, d)
			} else {
				var e = [],
					f = this.getChildren(),
					g = f.length;
				for (var h = 0; h < g; h++) e = e.concat(f[h]._get(a));
				Kinetic.Collection.apply(b, e)
			}
			return b
		},
		_getNodeById: function(a) {
			var b = this.getStage(),
				c = Kinetic.Global,
				d = c.ids[a];
			return d !== undefined && this.isAncestorOf(d) ? d : null
		},
		_getNodesByName: function(a) {
			var b = Kinetic.Global,
				c = b.names[a] || [];
			return this._getDescendants(c)
		},
		_get: function(a) {
			var b = Kinetic.Node.prototype._get.call(this, a),
				c = this.getChildren(),
				d = c.length;
			for (var e = 0; e < d; e++) b = b.concat(c[e]._get(a));
			return b
		},
		toObject: function() {
			var a = Kinetic.Node.prototype.toObject.call(this);
			a.children = [];
			var b = this.getChildren(),
				c = b.length;
			for (var d = 0; d < c; d++) {
				var e = b[d];
				a.children.push(e.toObject())
			}
			return a
		},
		_getDescendants: function(a) {
			var b = [],
				c = a.length;
			for (var d = 0; d < c; d++) {
				var e = a[d];
				this.isAncestorOf(e) && b.push(e)
			}
			return b
		},
		isAncestorOf: function(a) {
			var b = a.getParent();
			while (b) {
				if (b._id === this._id) return !0;
				b = b.getParent()
			}
			return !1
		},
		clone: function(a) {
			var b = Kinetic.Node.prototype.clone.call(this, a);
			return this.getChildren().each(function(a) {
				b.add(a.clone())
			}), b
		},
		getAllIntersections: function() {
			var a = Kinetic.Util._getXY(Array.prototype.slice.call(arguments)),
				b = [],
				c = this.get("Shape"),
				d = c.length;
			for (var e = 0; e < d; e++) {
				var f = c[e];
				f.isVisible() && f.intersects(a) && b.push(f)
			}
			return b
		},
		_setChildrenIndices: function() {
			var a = this.children,
				b = a.length;
			for (var c = 0; c < b; c++) a[c].index = c
		},
		drawScene: function(a) {
			var b = this.getLayer(),
				c = !!this.getClipFunc(),
				d, e, f;
			!a && b && (a = b.getCanvas());
			if (this.isVisible()) {
				c && a._clip(this), d = this.children, f = d.length;
				for (e = 0; e < f; e++) d[e].drawScene(a);
				c && a.getContext().restore()
			}
		},
		drawHit: function() {
			var a = !!this.getClipFunc() && this.nodeType !== "Stage",
				b = 0,
				c = 0,
				d = [],
				e;
			if (this.shouldDrawHit()) {
				a && (e = this.getLayer().hitCanvas, e._clip(this)), d = this.children, c = d.length;
				for (b = 0; b < c; b++) d[b].drawHit();
				a && e.getContext().restore()
			}
		}
	}), Kinetic.Util.extend(Kinetic.Container, Kinetic.Node), Kinetic.Node.addGetterSetter(Kinetic.Container, "clipFunc")
}(),
function() {
	function a(a) {
		a.fill()
	}

	function b(a) {
		a.stroke()
	}

	function c(a) {
		a.fill()
	}

	function d(a) {
		a.stroke()
	}
	Kinetic.Util.addMethods(Kinetic.Shape, {
		_initShape: function(e) {
			this.nodeType = "Shape", this._fillFunc = a, this._strokeFunc = b, this._fillFuncHit = c, this._strokeFuncHit = d;
			var f = Kinetic.Global.shapes,
				g;
			for (;;) {
				g = Kinetic.Util.getRandomColor();
				if (g && !(g in f)) break
			}
			this.colorKey = g, f[g] = this, this.createAttrs(), Kinetic.Node.call(this, e)
		},
		getContext: function() {
			return this.getLayer().getContext()
		},
		getCanvas: function() {
			return this.getLayer().getCanvas()
		},
		hasShadow: function() {
			return !!(this.getShadowColor() || this.getShadowBlur() || this.getShadowOffsetX() || this.getShadowOffsetY())
		},
		hasFill: function() {
			return !!(this.getFill() || this.getFillPatternImage() || this.getFillLinearGradientColorStops() || this.getFillRadialGradientColorStops())
		},
		_get: function(a) {
			return this.className === a || this.nodeType === a ? [this] : []
		},
		intersects: function() {
			var a = Kinetic.Util._getXY(Array.prototype.slice.call(arguments)),
				b = this.getStage(),
				c = b.hitCanvas;
			c.clear(), this.drawScene(c);
			var d = c.context.getImageData(a.x | 0, a.y | 0, 1, 1).data;
			return d[3] > 0
		},
		enableFill: function() {
			this._setAttr("fillEnabled", !0)
		},
		disableFill: function() {
			this._setAttr("fillEnabled", !1)
		},
		enableStroke: function() {
			this._setAttr("strokeEnabled", !0)
		},
		disableStroke: function() {
			this._setAttr("strokeEnabled", !1)
		},
		enableStrokeScale: function() {
			this._setAttr("strokeScaleEnabled", !0)
		},
		disableStrokeScale: function() {
			this._setAttr("strokeScaleEnabled", !1)
		},
		enableShadow: function() {
			this._setAttr("shadowEnabled", !0)
		},
		disableShadow: function() {
			this._setAttr("shadowEnabled", !1)
		},
		enableDashArray: function() {
			this._setAttr("dashArrayEnabled", !0)
		},
		disableDashArray: function() {
			this._setAttr("dashArrayEnabled", !1)
		},
		destroy: function() {
			Kinetic.Node.prototype.destroy.call(this), delete Kinetic.Global.shapes[this.colorKey]
		},
		drawScene: function(a) {
			var b = this.getDrawFunc(),
				a = a || this.getLayer().getCanvas(),
				c = a.getContext();
			b && this.isVisible() && (c.save(), a._applyOpacity(this), a._applyLineJoin(this), a._applyAncestorTransforms(this), b.call(this, a), c.restore())
		},
		drawHit: function() {
			var a = this.getAttrs(),
				b = a.drawHitFunc || a.drawFunc,
				c = this.getLayer().hitCanvas,
				d = c.getContext();
			b && this.shouldDrawHit() && (d.save(), c._applyLineJoin(this), c._applyAncestorTransforms(this), b.call(this, c), d.restore())
		},
		_setDrawFuncs: function() {
			!this.attrs.drawFunc && this.drawFunc && this.setDrawFunc(this.drawFunc), !this.attrs.drawHitFunc && this.drawHitFunc && this.setDrawHitFunc(this.drawHitFunc)
		}
	}), Kinetic.Util.extend(Kinetic.Shape, Kinetic.Node), Kinetic.Node.addColorGetterSetter(Kinetic.Shape, "stroke"), Kinetic.Node.addGetterSetter(Kinetic.Shape, "lineJoin"), Kinetic.Node.addGetterSetter(Kinetic.Shape, "lineCap"), Kinetic.Node.addGetterSetter(Kinetic.Shape, "strokeWidth"), Kinetic.Node.addGetterSetter(Kinetic.Shape, "drawFunc"), Kinetic.Node.addGetterSetter(Kinetic.Shape, "drawHitFunc"), Kinetic.Node.addGetterSetter(Kinetic.Shape, "dashArray"), Kinetic.Node.addColorGetterSetter(Kinetic.Shape, "shadowColor"), Kinetic.Node.addGetterSetter(Kinetic.Shape, "shadowBlur"), Kinetic.Node.addGetterSetter(Kinetic.Shape, "shadowOpacity"), Kinetic.Node.addGetterSetter(Kinetic.Shape, "fillPatternImage"), Kinetic.Node.addColorGetterSetter(Kinetic.Shape, "fill"), Kinetic.Node.addGetterSetter(Kinetic.Shape, "fillPatternX"), Kinetic.Node.addGetterSetter(Kinetic.Shape, "fillPatternY"), Kinetic.Node.addGetterSetter(Kinetic.Shape, "fillLinearGradientColorStops"), Kinetic.Node.addGetterSetter(Kinetic.Shape, "fillRadialGradientStartRadius"), Kinetic.Node.addGetterSetter(Kinetic.Shape, "fillRadialGradientEndRadius"), Kinetic.Node.addGetterSetter(Kinetic.Shape, "fillRadialGradientColorStops"), Kinetic.Node.addGetterSetter(Kinetic.Shape, "fillPatternRepeat"), Kinetic.Node.addGetterSetter(Kinetic.Shape, "fillEnabled", !0), Kinetic.Node.addGetterSetter(Kinetic.Shape, "strokeEnabled", !0), Kinetic.Node.addGetterSetter(Kinetic.Shape, "shadowEnabled", !0), Kinetic.Node.addGetterSetter(Kinetic.Shape, "dashArrayEnabled", !0), Kinetic.Node.addGetterSetter(Kinetic.Shape, "fillPriority", "color"), Kinetic.Node.addGetterSetter(Kinetic.Shape, "strokeScaleEnabled", !0), Kinetic.Node.addPointGetterSetter(Kinetic.Shape, "fillPatternOffset", 0), Kinetic.Node.addPointGetterSetter(Kinetic.Shape, "fillPatternScale", 1), Kinetic.Node.addPointGetterSetter(Kinetic.Shape, "fillLinearGradientStartPoint", 0), Kinetic.Node.addPointGetterSetter(Kinetic.Shape, "fillLinearGradientEndPoint", 0), Kinetic.Node.addPointGetterSetter(Kinetic.Shape, "fillRadialGradientStartPoint", 0), Kinetic.Node.addPointGetterSetter(Kinetic.Shape, "fillRadialGradientEndPoint", 0), Kinetic.Node.addPointGetterSetter(Kinetic.Shape, "shadowOffset", 0), Kinetic.Node.addRotationGetterSetter(Kinetic.Shape, "fillPatternRotation", 0)
}(),
function() {
	function n(a, b) {
		a.content.addEventListener(b, function(c) {
			c.preventDefault(), a[UNDERSCORE + b](c)
		}, !1)
	}
	var a = "Stage",
		b = "string",
		c = "px",
		d = "mouseout",
		e = "mouseleave",
		d = "mouseout",
		f = "mouseover",
		g = "mouseenter",
		h = "mousemove",
		i = "mousedown",
		j = "mouseup",
		k = "click",
		l = "dblclick",
		m = "touchstart";
	TOUCHEND = "touchend", TAP = "tap", DBL_TAP = "dbltap", TOUCHMOVE = "touchmove", DIV = "div", RELATIVE = "relative", INLINE_BLOCK = "inline-block", KINETICJS_CONTENT = "kineticjs-content", SPACE = " ", UNDERSCORE = "_", CONTAINER = "container", EVENTS = [i, h, j, d, m, TOUCHMOVE, TOUCHEND], eventsLength = EVENTS.length, Kinetic.Util.addMethods(Kinetic.Stage, {
		_initStage: function(b) {
			this.createAttrs(), Kinetic.Container.call(this, b), this.nodeType = a, this.dblClickWindow = 400, this._id = Kinetic.Global.idCounter++, this._buildDOM(), this._bindContentEvents(), Kinetic.Global.stages.push(this)
		},
		setContainer: function(a) {
			typeof a === b && (a = document.getElementById(a)), this._setAttr(CONTAINER, a)
		},
		draw: function() {
			var a = this.getChildren(),
				b = a.length,
				c, d;
			for (c = 0; c < b; c++) d = a[c], d.getClearBeforeDraw() && (d.getCanvas().clear(), d.getHitCanvas().clear());
			Kinetic.Node.prototype.draw.call(this)
		},
		setHeight: function(a) {
			Kinetic.Node.prototype.setHeight.call(this, a), this._resizeDOM()
		},
		setWidth: function(a) {
			Kinetic.Node.prototype.setWidth.call(this, a), this._resizeDOM()
		},
		clear: function() {
			var a = this.children,
				b = a.length,
				c;
			for (c = 0; c < b; c++) a[c].clear()
		},
		remove: function() {
			var a = this.content;
			Kinetic.Node.prototype.remove.call(this), a && Kinetic.Util._isInDocument(a) && this.getContainer().removeChild(a)
		},
		getMousePosition: function() {
			return this.mousePos
		},
		getTouchPosition: function() {
			return this.touchPos
		},
		getPointerPosition: function() {
			return this.getTouchPosition() || this.getMousePosition()
		},
		getStage: function() {
			return this
		},
		getContent: function() {
			return this.content
		},
		toDataURL: function(a) {
			function i(d) {
				var e = h[d],
					j = e.toDataURL(),
					k = new Image;
				k.onload = function() {
					g.drawImage(k, 0, 0), d < h.length - 1 ? i(d + 1) : a.callback(f.toDataURL(b, c))
				}, k.src = j
			}
			var a = a || {},
				b = a.mimeType || null,
				c = a.quality || null,
				d = a.x || 0,
				e = a.y || 0,
				f = new Kinetic.SceneCanvas({
					width: a.width || this.getWidth(),
					height: a.height || this.getHeight(),
					pixelRatio: 1
				}),
				g = f.getContext(),
				h = this.children;
			(d || e) && g.translate(-1 * d, -1 * e), i(0)
		},
		toImage: function(a) {
			var b = a.callback;
			a.callback = function(a) {
				Kinetic.Util._getImage(a, function(a) {
					b(a)
				})
			}, this.toDataURL(a)
		},
		getIntersection: function() {
			var a = Kinetic.Util._getXY(Array.prototype.slice.call(arguments)),
				b = this.getChildren(),
				c = b.length,
				d = c - 1,
				e, f;
			for (e = d; e >= 0; e--) {
				f = b[e].getIntersection(a);
				if (f) return f
			}
			return null
		},
		_resizeDOM: function() {
			if (this.content) {
				var a = this.getWidth(),
					b = this.getHeight(),
					d = this.getChildren(),
					e = d.length,
					f;
				this.content.style.width = a + c, this.content.style.height = b + c, this.bufferCanvas.setSize(a, b, 1), this.hitCanvas.setSize(a, b);
				for (f = 0; f < e; f++) layer = d[f], layer.getCanvas().setSize(a, b), layer.hitCanvas.setSize(a, b), layer.draw()
			}
		},
		add: function(a) {
			return Kinetic.Container.prototype.add.call(this, a), a.canvas.setSize(this.attrs.width, this.attrs.height), a.hitCanvas.setSize(this.attrs.width, this.attrs.height), a.draw(), this.content.appendChild(a.canvas.element), this
		},
		getParent: function() {
			return null
		},
		getLayer: function() {
			return null
		},
		getLayers: function() {
			return this.getChildren()
		},
		_setPointerPosition: function(a) {
			a || (a = window.event), this._setMousePosition(a), this._setTouchPosition(a)
		},
		_bindContentEvents: function() {
			var a = this,
				b;
			for (b = 0; b < eventsLength; b++) n(this, EVENTS[b])
		},
		_mouseout: function(a) {
			this._setPointerPosition(a);
			var b = Kinetic.Global,
				c = this.targetShape;
			c && !b.isDragging() && (c._fireAndBubble(d, a), c._fireAndBubble(e, a), this.targetShape = null), this.mousePos = undefined
		},
		_mousemove: function(a) {
			this._setPointerPosition(a);
			var b = Kinetic.Global,
				c = Kinetic.DD,
				i = this.getIntersection(this.getPointerPosition()),
				j;
			i ? (j = i.shape, j && (!b.isDragging() && i.pixel[3] === 255 && (!this.targetShape || this.targetShape._id !== j._id) ? (this.targetShape && (this.targetShape._fireAndBubble(d, a, j), this.targetShape._fireAndBubble(e, a, j)), j._fireAndBubble(f, a, this.targetShape), j._fireAndBubble(g, a, this.targetShape), this.targetShape = j) : j._fireAndBubble(h, a))) : this.targetShape && !b.isDragging() && (this.targetShape._fireAndBubble(d, a), this.targetShape._fireAndBubble(e, a), this.targetShape = null), c && c._drag(a)
		},
		_mousedown: function(a) {
			this._setPointerPosition(a);
			var b = Kinetic.Global,
				c = this.getIntersection(this.getPointerPosition()),
				d;
			c && c.shape && (d = c.shape, this.clickStart = !0, this.clickStartShape = d, d._fireAndBubble(i, a)), this.isDraggable() && !b.isDragReady() && this.startDrag(a)
		},
		_mouseup: function(a) {
			this._setPointerPosition(a);
			var b = this,
				c = Kinetic.Global,
				d = this.getIntersection(this.getPointerPosition()),
				e;
			d && d.shape && (e = d.shape, e._fireAndBubble(j, a), this.clickStart && !c.isDragging() && e._id === this.clickStartShape._id && (e._fireAndBubble(k, a), this.inDoubleClickWindow && e._fireAndBubble(l, a), this.inDoubleClickWindow = !0, setTimeout(function() {
				b.inDoubleClickWindow = !1
			}, this.dblClickWindow))), this.clickStart = !1
		},
		_touchstart: function(a) {
			this._setPointerPosition(a);
			var b = Kinetic.Global,
				c = this.getIntersection(this.getPointerPosition()),
				d;
			c && c.shape && (d = c.shape, this.tapStart = !0, this.tapStartShape = d, d._fireAndBubble(m, a)), this.isDraggable() && !b.isDragReady() && this.startDrag(a)
		},
		_touchend: function(a) {
			this._setPointerPosition(a);
			var b = this,
				c = Kinetic.Global,
				d = this.getIntersection(this.getPointerPosition()),
				e;
			d && d.shape && (e = d.shape, e._fireAndBubble(TOUCHEND, a), this.tapStart && !c.isDragging() && e._id === this.tapStartShape._id && (e._fireAndBubble(TAP, a), this.inDoubleClickWindow && e._fireAndBubble(DBL_TAP, a), this.inDoubleClickWindow = !0, setTimeout(function() {
				b.inDoubleClickWindow = !1
			}, this.dblClickWindow))), this.tapStart = !1
		},
		_touchmove: function(a) {
			this._setPointerPosition(a);
			var b = Kinetic.DD,
				c = this.getIntersection(this.getPointerPosition()),
				d;
			c && c.shape && (d = c.shape, d._fireAndBubble(TOUCHMOVE, a)), b && b._drag(a)
		},
		_setMousePosition: function(a) {
			var b = a.clientX - this._getContentPosition().left,
				c = a.clientY - this._getContentPosition().top;
			this.mousePos = {
				x: b,
				y: c
			}
		},
		_setTouchPosition: function(a) {
			var b, c, d;
			a.touches !== undefined && a.touches.length === 1 && (b = a.touches[0], c = b.clientX - this._getContentPosition().left, d = b.clientY - this._getContentPosition().top, this.touchPos = {
				x: c,
				y: d
			})
		},
		_getContentPosition: function() {
			var a = this.content.getBoundingClientRect();
			return {
				top: a.top,
				left: a.left
			}
		},
		_buildDOM: function() {
			this.content = document.createElement(DIV), this.content.style.position = RELATIVE, this.content.style.display = INLINE_BLOCK, this.content.className = KINETICJS_CONTENT, this.attrs.container.appendChild(this.content), this.bufferCanvas = new Kinetic.SceneCanvas, this.hitCanvas = new Kinetic.HitCanvas, this._resizeDOM()
		},
		_onContent: function(a, b) {
			var c = a.split(SPACE),
				d = c.length,
				e, f;
			for (e = 0; e < d; e++) f = c[e], this.content.addEventListener(f, b, !1)
		}
	}), Kinetic.Util.extend(Kinetic.Stage, Kinetic.Container), Kinetic.Node.addGetter(Kinetic.Stage, "container")
}(),
function() {
	var a = "#";
	Kinetic.Util.addMethods(Kinetic.Layer, {
		_initLayer: function(a) {
			this.nodeType = "Layer", this.createAttrs(), this.canvas = new Kinetic.SceneCanvas, this.canvas.getElement().style.position = "absolute", this.hitCanvas = new Kinetic.HitCanvas, Kinetic.Container.call(this, a)
		},
		getIntersection: function() {
			var b = Kinetic.Util._getXY(Array.prototype.slice.call(arguments)),
				c, d, e;
			if (this.isVisible() && this.isListening()) {
				c = this.hitCanvas.context.getImageData(b.x | 0, b.y | 0, 1, 1).data;
				if (c[3] === 255) return d = Kinetic.Util._rgbToHex(c[0], c[1], c[2]), e = Kinetic.Global.shapes[a + d], {
					shape: e,
					pixel: c
				};
				if (c[0] > 0 || c[1] > 0 || c[2] > 0 || c[3] > 0) return {
					pixel: c
				}
			}
			return null
		},
		drawScene: function(a) {
			var a = a || this.getCanvas();
			this.getClearBeforeDraw() && a.clear(), Kinetic.Container.prototype.drawScene.call(this, a)
		},
		drawHit: function() {
			var a = this.getLayer();
			a && a.getClearBeforeDraw() && a.getHitCanvas().clear(), Kinetic.Container.prototype.drawHit.call(this)
		},
		getCanvas: function() {
			return this.canvas
		},
		getHitCanvas: function() {
			return this.hitCanvas
		},
		getContext: function() {
			return this.getCanvas().getContext()
		},
		clear: function() {
			this.getCanvas().clear()
		},
		setVisible: function(a) {
			Kinetic.Node.prototype.setVisible.call(this, a), a ? (this.getCanvas().element.style.display = "block", this.hitCanvas.element.style.display = "block") : (this.getCanvas().element.style.display = "none", this.hitCanvas.element.style.display = "none")
		},
		setZIndex: function(a) {
			Kinetic.Node.prototype.setZIndex.call(this, a);
			var b = this.getStage();
			b && (b.content.removeChild(this.getCanvas().element), a < b.getChildren().length - 1 ? b.content.insertBefore(this.getCanvas().element, b.getChildren()[a + 1].getCanvas().element) : b.content.appendChild(this.getCanvas().element))
		},
		moveToTop: function() {
			Kinetic.Node.prototype.moveToTop.call(this);
			var a = this.getStage();
			a && (a.content.removeChild(this.getCanvas().element), a.content.appendChild(this.getCanvas().element))
		},
		moveUp: function() {
			if (Kinetic.Node.prototype.moveUp.call(this)) {
				var a = this.getStage();
				a && (a.content.removeChild(this.getCanvas().element), this.index < a.getChildren().length - 1 ? a.content.insertBefore(this.getCanvas().element, a.getChildren()[this.index + 1].getCanvas().element) : a.content.appendChild(this.getCanvas().element))
			}
		},
		moveDown: function() {
			if (Kinetic.Node.prototype.moveDown.call(this)) {
				var a = this.getStage();
				if (a) {
					var b = a.getChildren();
					a.content.removeChild(this.getCanvas().element), a.content.insertBefore(this.getCanvas().element, b[this.index + 1].getCanvas().element)
				}
			}
		},
		moveToBottom: function() {
			if (Kinetic.Node.prototype.moveToBottom.call(this)) {
				var a = this.getStage();
				if (a) {
					var b = a.getChildren();
					a.content.removeChild(this.getCanvas().element), a.content.insertBefore(this.getCanvas().element, b[1].getCanvas().element)
				}
			}
		},
		getLayer: function() {
			return this
		},
		remove: function() {
			var a = this.getStage(),
				b = this.getCanvas(),
				c = b.element;
			Kinetic.Node.prototype.remove.call(this), a && b && Kinetic.Util._isInDocument(c) && a.content.removeChild(c)
		}
	}), Kinetic.Util.extend(Kinetic.Layer, Kinetic.Container), Kinetic.Node.addGetterSetter(Kinetic.Layer, "clearBeforeDraw", !0)
}(),
function() {
	Kinetic.Util.addMethods(Kinetic.Group, {
		_initGroup: function(a) {
			this.nodeType = "Group", this.createAttrs(), Kinetic.Container.call(this, a)
		}
	}), Kinetic.Util.extend(Kinetic.Group, Kinetic.Container)
}(),
function() {
	Kinetic.Rect = function(a) {
		this._initRect(a)
	}, Kinetic.Rect.prototype = {
		_initRect: function(a) {
			this.createAttrs(), Kinetic.Shape.call(this, a), this.className = "Rect", this._setDrawFuncs()
		},
		drawFunc: function(a) {
			var b = a.getContext(),
				c = this.getCornerRadius(),
				d = this.getWidth(),
				e = this.getHeight();
			b.beginPath(), c ? (b.moveTo(c, 0), b.lineTo(d - c, 0), b.arc(d - c, c, c, Math.PI * 3 / 2, 0, !1), b.lineTo(d, e - c), b.arc(d - c, e - c, c, 0, Math.PI / 2, !1), b.lineTo(c, e), b.arc(c, e - c, c, Math.PI / 2, Math.PI, !1), b.lineTo(0, c), b.arc(c, c, c, Math.PI, Math.PI * 3 / 2, !1)) : b.rect(0, 0, d, e), b.closePath(), a.fillStroke(this)
		}
	}, Kinetic.Util.extend(Kinetic.Rect, Kinetic.Shape), Kinetic.Node.addGetterSetter(Kinetic.Rect, "cornerRadius", 0)
}(),
function() {
	Kinetic.Circle = function(a) {
		this._initCircle(a)
	}, Kinetic.Circle.prototype = {
		_initCircle: function(a) {
			this.createAttrs(), Kinetic.Shape.call(this, a), this.className = "Circle", this._setDrawFuncs()
		},
		drawFunc: function(a) {
			var b = a.getContext();
			b.beginPath(), b.arc(0, 0, this.getRadius(), 0, Math.PI * 2, !0), b.closePath(), a.fillStroke(this)
		},
		getWidth: function() {
			return this.getRadius() * 2
		},
		getHeight: function() {
			return this.getRadius() * 2
		},
		setWidth: function(a) {
			Kinetic.Node.prototype.setWidth.call(this, a), this.setRadius(a / 2)
		},
		setHeight: function(a) {
			Kinetic.Node.prototype.setHeight.call(this, a), this.setRadius(a / 2)
		}
	}, Kinetic.Util.extend(Kinetic.Circle, Kinetic.Shape), Kinetic.Node.addGetterSetter(Kinetic.Circle, "radius", 0)
}(),
function() {
	Kinetic.Wedge = function(a) {
		this._initWedge(a)
	}, Kinetic.Wedge.prototype = {
		_initWedge: function(a) {
			this.createAttrs(), Kinetic.Shape.call(this, a), this.className = "Wedge", this._setDrawFuncs()
		},
		drawFunc: function(a) {
			var b = a.getContext();
			b.beginPath(), b.arc(0, 0, this.getRadius(), 0, this.getAngle(), this.getClockwise()), b.lineTo(0, 0), b.closePath(), a.fillStroke(this)
		}
	}, Kinetic.Util.extend(Kinetic.Wedge, Kinetic.Shape), Kinetic.Node.addGetterSetter(Kinetic.Wedge, "radius", 0), Kinetic.Node.addRotationGetterSetter(Kinetic.Wedge, "angle", 0), Kinetic.Node.addGetterSetter(Kinetic.Wedge, "clockwise", !1)
}(),
function() {
	var a = "Image",
		b = "crop",
		c = "set";
	Kinetic.Image = function(a) {
		this._initImage(a)
	}, Kinetic.Image.prototype = {
		_initImage: function(b) {
			var c = this;
			Kinetic.Shape.call(this, b), this.className = a, this._setDrawFuncs()
		},
		drawFunc: function(a) {
			var b = this.getWidth(),
				c = this.getHeight(),
				d, e = this,
				f = a.getContext(),
				g = this.getCrop(),
				h, i, j, k, l;
			this.getFilter() && this._applyFilter && (this.applyFilter(), this._applyFilter = !1), this.filterCanvas ? l = this.filterCanvas.getElement() : l = this.getImage(), f.beginPath(), f.rect(0, 0, b, c), f.closePath(), a.fillStroke(this), l && (g ? (h = g.x || 0, i = g.y || 0, j = g.width || 0, k = g.height || 0, d = [l, h, i, j, k, 0, 0, b, c]) : d = [l, 0, 0, b, c], this.hasShadow() ? a.applyShadow(this, function() {
				e._drawImage(f, d)
			}) : this._drawImage(f, d))
		},
		drawHitFunc: function(a) {
			var b = this.getWidth(),
				c = this.getHeight(),
				d = this.imageHitRegion,
				e = a.getContext();
			d ? (e.drawImage(d, 0, 0, b, c), e.beginPath(), e.rect(0, 0, b, c), e.closePath(), a.stroke(this)) : (e.beginPath(), e.rect(0, 0, b, c), e.closePath(), a.fillStroke(this))
		},
		applyFilter: function() {
			var a = this.getImage(),
				b = this,
				c = this.getWidth(),
				d = this.getHeight(),
				e = this.getFilter(),
				f, g, h;
			this.filterCanvas ? f = this.filterCanvas : f = this.filterCanvas = new Kinetic.SceneCanvas({
				width: c,
				height: d
			}), g = f.getContext();
			try {
				this._drawImage(g, [a, 0, 0, c, d]), h = g.getImageData(0, 0, f.getWidth(), f.getHeight()), e.call(this, h), g.putImageData(h, 0, 0)
			} catch (i) {
				this.clearFilter(), Kinetic.Util.warn("Unable to apply filter. " + i.message)
			}
		},
		clearFilter: function() {
			this.filterCanvas = null, this._applyFilter = !1
		},
		setCrop: function() {
			var a = [].slice.call(arguments),
				c = Kinetic.Util._getXY(a),
				d = Kinetic.Util._getSize(a),
				e = Kinetic.Util._merge(c, d);
			this._setAttr(b, Kinetic.Util._merge(e, this.getCrop()))
		},
		createImageHitRegion: function(a) {
			var b = this,
				c = this.getWidth(),
				d = this.getHeight(),
				e = new Kinetic.Canvas({
					width: c,
					height: d
				}),
				f = e.getContext(),
				g = this.getImage(),
				h, i, j, k, l;
			f.drawImage(g, 0, 0);
			try {
				h = f.getImageData(0, 0, c, d), i = h.data, j = Kinetic.Util._hexToRgb(this.colorKey);
				for (k = 0, l = i.length; k < l; k += 4) i[k + 3] > 0 && (i[k] = j.r, i[k + 1] = j.g, i[k + 2] = j.b);
				Kinetic.Util._getImage(h, function(c) {
					b.imageHitRegion = c, a && a()
				})
			} catch (m) {
				Kinetic.Util.warn("Unable to create image hit region. " + m.message)
			}
		},
		clearImageHitRegion: function() {
			delete this.imageHitRegion
		},
		getWidth: function() {
			var a = this.getImage();
			return this.attrs.width || (a ? a.width : 0)
		},
		getHeight: function() {
			var a = this.getImage();
			return this.attrs.height || (a ? a.height : 0)
		},
		_drawImage: function(a, b) {
			b.length === 5 ? a.drawImage(b[0], b[1], b[2], b[3], b[4]) : b.length === 9 && a.drawImage(b[0], b[1], b[2], b[3], b[4], b[5], b[6], b[7], b[8])
		}
	}, Kinetic.Util.extend(Kinetic.Image, Kinetic.Shape), Kinetic.Node.addFilterGetterSetter = function(a, b, c) {
		this.addGetter(a, b, c), this.addFilterSetter(a, b)
	}, Kinetic.Node.addFilterSetter = function(a, b) {
		var d = this,
			e = c + Kinetic.Util._capitalize(b);
		a.prototype[e] = function(a) {
			this._setAttr(b, a), this._applyFilter = !0
		}
	}, Kinetic.Node.addGetterSetter(Kinetic.Image, "image"), Kinetic.Node.addGetter(Kinetic.Image, "crop"), Kinetic.Node.addFilterGetterSetter(Kinetic.Image, "filter")
}(),
function() {
	Kinetic.Polygon = function(a) {
		this._initPolygon(a)
	}, Kinetic.Polygon.prototype = {
		_initPolygon: function(a) {
			this.createAttrs(), Kinetic.Shape.call(this, a), this.className = "Polygon", this._setDrawFuncs()
		},
		drawFunc: function(a) {
			var b = a.getContext(),
				c = this.getPoints(),
				d = c.length;
			b.beginPath(), b.moveTo(c[0].x, c[0].y);
			for (var e = 1; e < d; e++) b.lineTo(c[e].x, c[e].y);
			b.closePath(), a.fillStroke(this)
		},
		setPoints: function(a) {
			this._setAttr("points", Kinetic.Util._getPoints(a))
		},
		getPoints: function() {
			return this.attrs.points || []
		}
	}, Kinetic.Util.extend(Kinetic.Polygon, Kinetic.Shape)
}(),
function() {
	function y(a) {
		a.fillText(this.partialText, 0, 0)
	}

	function z(a) {
		a.strokeText(this.partialText, 0, 0)
	}
	var a = "auto",
		b = "Calibri",
		c = "canvas",
		d = "center",
		e = "Change.kinetic",
		f = "2d",
		g = "-",
		h = "",
		i = "left",
		j = "\n",
		k = "text",
		l = "Text",
		m = "top",
		n = "middle",
		o = "normal",
		p = "px ",
		q = " ",
		r = "right",
		s = "word",
		t = "char",
		u = "none",
		v = ["fontFamily", "fontSize", "fontStyle", "padding", "align", "lineHeight", "text", "width", "height", "wrap"],
		w = v.length,
		x = document.createElement(c).getContext(f);
	Kinetic.Text = function(a) {
		this._initText(a)
	}, Kinetic.Text.prototype = {
		_initText: function(b) {
			var c = this;
			this.createAttrs(), this.attrs.width = a, this.attrs.height = a, Kinetic.Shape.call(this, b), this._fillFunc = y, this._strokeFunc = z, this.className = l, this._setDrawFuncs();
			for (var d = 0; d < w; d++) this.on(v[d] + e, c._setTextData);
			this._setTextData()
		},
		drawFunc: function(a) {
			var b = a.getContext(),
				c = this.getPadding(),
				e = this.getFontStyle(),
				f = this.getFontSize(),
				g = this.getFontFamily(),
				h = this.getTextHeight(),
				j = this.getLineHeight() * h,
				k = this.textArr,
				l = k.length,
				m = this.getWidth();
			b.font = this._getContextFont(), b.textBaseline = n, b.textAlign = i, b.save(), b.translate(c, 0), b.translate(0, c + h / 2);
			for (var o = 0; o < l; o++) {
				var p = k[o],
					q = p.text,
					s = p.width;
				b.save(), this.getAlign() === r ? b.translate(m - s - c * 2, 0) : this.getAlign() === d && b.translate((m - s - c * 2) / 2, 0), this.partialText = q, a.fillStroke(this), b.restore(), b.translate(0, j)
			}
			b.restore()
		},
		drawHitFunc: function(a) {
			var b = a.getContext(),
				c = this.getWidth(),
				d = this.getHeight();
			b.beginPath(), b.rect(0, 0, c, d), b.closePath(), a.fillStroke(this)
		},
		setText: function(a) {
			var b = Kinetic.Util._isString(a) ? a : a.toString();
			this._setAttr(k, b)
		},
		getWidth: function() {
			return this.attrs.width === a ? this.getTextWidth() + this.getPadding() * 2 : this.attrs.width
		},
		getHeight: function() {
			return this.attrs.height === a ? this.getTextHeight() * this.textArr.length * this.getLineHeight() + this.getPadding() * 2 : this.attrs.height
		},
		getTextWidth: function() {
			return this.textWidth
		},
		getTextHeight: function() {
			return this.textHeight
		},
		_getTextSize: function(a) {
			var b = x,
				c = this.getFontSize(),
				d;
			return b.save(), b.font = this._getContextFont(), d = b.measureText(a), b.restore(), {
				width: d.width,
				height: parseInt(c, 10)
			}
		},
		_getContextFont: function() {
			return this.getFontStyle() + q + this.getFontSize() + p + this.getFontFamily()
		},
		_addTextLine: function(a, b, c) {
			return this.textArr.push({
				text: a,
				width: b
			})
		},
		_getTextWidth: function(a) {
			return x.measureText(a).width
		},
		_setTextData: function() {
			var b = this.getText().split("\n"),
				c = +this.getFontSize(),
				d = 0,
				e = this.getLineHeight() * c,
				f = this.attrs.width,
				h = this.attrs.height,
				i = f !== a,
				j = h !== a,
				k = this.getPadding(),
				l = f - k * 2,
				m = h - k * 2,
				n = 0,
				o = this.getWrap(),
				r = o !== u,
				s = o !== t && r;
			this.textArr = [], x.save(), x.font = this.getFontStyle() + q + c + p + this.getFontFamily();
			for (var v = 0, w = b.length; v < w; ++v) {
				var y = b[v],
					z = this._getTextWidth(y);
				if (i && z > l)
					while (y.length > 0) {
						var A = 0,
							B = y.length,
							C = "",
							D = 0;
						while (A < B) {
							var E = A + B >>> 1,
								F = y.slice(0, E + 1),
								G = this._getTextWidth(F);
							G <= l ? (A = E + 1, C = F, D = G) : B = E
						}
						if (!C) break;
						if (s) {
							var H = Math.max(C.lastIndexOf(q), C.lastIndexOf(g)) + 1;
							H > 0 && (A = H, C = C.slice(0, A), D = this._getTextWidth(C))
						}
						this._addTextLine(C, D), n += e;
						if (!r || j && n + e > m) break;
						y = y.slice(A);
						if (y.length > 0) {
							z = this._getTextWidth(y);
							if (z <= l) {
								this._addTextLine(y, z), n += e;
								break
							}
						}
					} else this._addTextLine(y, z), n += e, d = Math.max(d, z);
				if (j && n + e > m) break
			}
			x.restore(), this.textHeight = c, this.textWidth = d
		}
	}, Kinetic.Util.extend(Kinetic.Text, Kinetic.Shape), Kinetic.Node.addGetterSetter(Kinetic.Text, "fontFamily", b), Kinetic.Node.addGetterSetter(Kinetic.Text, "fontSize", 12), Kinetic.Node.addGetterSetter(Kinetic.Text, "fontStyle", o), Kinetic.Node.addGetterSetter(Kinetic.Text, "padding", 0), Kinetic.Node.addGetterSetter(Kinetic.Text, "align", i), Kinetic.Node.addGetterSetter(Kinetic.Text, "lineHeight", 1), Kinetic.Node.addGetterSetter(Kinetic.Text, "wrap", s), Kinetic.Node.addGetter(Kinetic.Text, k, h), Kinetic.Node.addSetter(Kinetic.Text, "width"), Kinetic.Node.addSetter(Kinetic.Text, "height")
}(),
function() {
	Kinetic.Line = function(a) {
		this._initLine(a)
	}, Kinetic.Line.prototype = {
		_initLine: function(a) {
			this.createAttrs(), Kinetic.Shape.call(this, a), this.className = "Line", this._setDrawFuncs()
		},
		drawFunc: function(a) {
			var b = this.getPoints(),
				c = b.length,
				d = a.getContext();
			d.beginPath(), d.moveTo(b[0].x, b[0].y);
			for (var e = 1; e < c; e++) {
				var f = b[e];
				d.lineTo(f.x, f.y)
			}
			a.stroke(this)
		},
		setPoints: function(a) {
			this._setAttr("points", Kinetic.Util._getPoints(a))
		},
		getPoints: function() {
			return this.attrs.points || []
		}
	}, Kinetic.Util.extend(Kinetic.Line, Kinetic.Shape)
}(),
function() {
	Kinetic.Spline = function(a) {
		this._initSpline(a)
	}, Kinetic.Spline._getControlPoints = function(a, b, c, d) {
		var e = a.x,
			f = a.y,
			g = b.x,
			h = b.y,
			i = c.x,
			j = c.y,
			k = Math.sqrt(Math.pow(g - e, 2) + Math.pow(h - f, 2)),
			l = Math.sqrt(Math.pow(i - g, 2) + Math.pow(j - h, 2)),
			m = d * k / (k + l),
			n = d * l / (k + l),
			o = g - m * (i - e),
			p = h - m * (j - f),
			q = g + n * (i - e),
			r = h + n * (j - f);
		return [{
			x: o,
			y: p
		}, {
			x: q,
			y: r
		}]
	}, Kinetic.Spline.prototype = {
		_initSpline: function(a) {
			this.createAttrs(), Kinetic.Line.call(this, a), this.className = "Spline"
		},
		drawFunc: function(a) {
			var b = this.getPoints(),
				c = b.length,
				d = a.getContext(),
				e = this.getTension();
			d.beginPath(), d.moveTo(b[0].x, b[0].y);
			if (e !== 0 && c > 2) {
				var f = this.allPoints,
					g = f.length;
				d.quadraticCurveTo(f[0].x, f[0].y, f[1].x, f[1].y);
				var h = 2;
				while (h < g - 1) d.bezierCurveTo(f[h].x, f[h++].y, f[h].x, f[h++].y, f[h].x, f[h++].y);
				d.quadraticCurveTo(f[g - 1].x, f[g - 1].y, b[c - 1].x, b[c - 1].y)
			} else
				for (var h = 1; h < c; h++) {
					var i = b[h];
					d.lineTo(i.x, i.y)
				}
			a.stroke(this)
		},
		setPoints: function(a) {
			Kinetic.Line.prototype.setPoints.call(this, a), this._setAllPoints()
		},
		setTension: function(a) {
			this._setAttr("tension", a), this._setAllPoints()
		},
		_setAllPoints: function() {
			var a = this.getPoints(),
				b = a.length,
				c = this.getTension(),
				d = [];
			for (var e = 1; e < b - 1; e++) {
				var f = Kinetic.Spline._getControlPoints(a[e - 1], a[e], a[e + 1], c);
				d.push(f[0]), d.push(a[e]), d.push(f[1])
			}
			this.allPoints = d
		}
	}, Kinetic.Util.extend(Kinetic.Spline, Kinetic.Line), Kinetic.Node.addGetter(Kinetic.Spline, "tension", 1)
}(),
function() {
	Kinetic.Blob = function(a) {
		this._initBlob(a)
	}, Kinetic.Blob.prototype = {
		_initBlob: function(a) {
			Kinetic.Spline.call(this, a), this.className = "Blob"
		},
		drawFunc: function(a) {
			var b = this.getPoints(),
				c = b.length,
				d = a.getContext(),
				e = this.getTension();
			d.beginPath(), d.moveTo(b[0].x, b[0].y);
			if (e !== 0 && c > 2) {
				var f = this.allPoints,
					g = f.length,
					h = 0;
				while (h < g - 1) d.bezierCurveTo(f[h].x, f[h++].y, f[h].x, f[h++].y, f[h].x, f[h++].y)
			} else
				for (var h = 1; h < c; h++) {
					var i = b[h];
					d.lineTo(i.x, i.y)
				}
			d.closePath(), a.fillStroke(this)
		},
		_setAllPoints: function() {
			var a = this.getPoints(),
				b = a.length,
				c = this.getTension(),
				d = Kinetic.Spline._getControlPoints(a[b - 1], a[0], a[1], c),
				e = Kinetic.Spline._getControlPoints(a[b - 2], a[b - 1], a[0], c);
			Kinetic.Spline.prototype._setAllPoints.call(this), this.allPoints.unshift(d[1]), this.allPoints.push(e[0]), this.allPoints.push(a[b - 1]), this.allPoints.push(e[1]), this.allPoints.push(d[0]), this.allPoints.push(a[0])
		}
	}, Kinetic.Util.extend(Kinetic.Blob, Kinetic.Spline)
}(),
function() {
	Kinetic.Sprite = function(a) {
		this._initSprite(a)
	}, Kinetic.Sprite.prototype = {
		_initSprite: function(a) {
			this.createAttrs(), Kinetic.Shape.call(this, a), this.className = "Sprite", this._setDrawFuncs(), this.anim = new Kinetic.Animation;
			var b = this;
			this.on("animationChange", function() {
				b.setIndex(0)
			})
		},
		drawFunc: function(a) {
			var b = this.getAnimation(),
				c = this.getIndex(),
				d = this.getAnimations()[b][c],
				e = a.getContext(),
				f = this.getImage();
			f && e.drawImage(f, d.x, d.y, d.width, d.height, 0, 0, d.width, d.height)
		},
		drawHitFunc: function(a) {
			var b = this.getAnimation(),
				c = this.getIndex(),
				d = this.getAnimations()[b][c],
				e = a.getContext();
			e.beginPath(), e.rect(0, 0, d.width, d.height), e.closePath(), a.fill(this)
		},
		start: function() {
			var a = this,
				b = this.getLayer();
			this.anim.setLayers(b), this.interval = setInterval(function() {
				var b = a.getIndex();
				a._updateIndex(), a.afterFrameFunc && b === a.afterFrameIndex && (a.afterFrameFunc(), delete a.afterFrameFunc, delete a.afterFrameIndex)
			}, 1e3 / this.getFrameRate()), this.anim.start()
		},
		stop: function() {
			this.anim.stop(), clearInterval(this.interval)
		},
		afterFrame: function(a, b) {
			this.afterFrameIndex = a, this.afterFrameFunc = b
		},
		_updateIndex: function() {
			var a = this.getIndex(),
				b = this.getAnimation(),
				c = this.getAnimations(),
				d = c[b],
				e = d.length;
			a < e - 1 ? this.setIndex(a + 1) : this.setIndex(0)
		}
	}, Kinetic.Util.extend(Kinetic.Sprite, Kinetic.Shape), Kinetic.Node.addGetterSetter(Kinetic.Sprite, "animation"), Kinetic.Node.addGetterSetter(Kinetic.Sprite, "animations"), Kinetic.Node.addGetterSetter(Kinetic.Sprite, "image"), Kinetic.Node.addGetterSetter(Kinetic.Sprite, "index", 0), Kinetic.Node.addGetterSetter(Kinetic.Sprite, "frameRate", 17)
}(),
function() {
	Kinetic.Path = function(a) {
		this._initPath(a)
	}, Kinetic.Path.prototype = {
		_initPath: function(a) {
			this.dataArray = [];
			var b = this;
			Kinetic.Shape.call(this, a), this.className = "Path", this._setDrawFuncs(), this.dataArray = Kinetic.Path.parsePathData(this.getData()), this.on("dataChange", function() {
				b.dataArray = Kinetic.Path.parsePathData(this.getData())
			})
		},
		drawFunc: function(a) {
			var b = this.dataArray,
				c = a.getContext();
			c.beginPath();
			for (var d = 0; d < b.length; d++) {
				var e = b[d].command,
					f = b[d].points;
				switch (e) {
					case "L":
						c.lineTo(f[0], f[1]);
						break;
					case "M":
						c.moveTo(f[0], f[1]);
						break;
					case "C":
						c.bezierCurveTo(f[0], f[1], f[2], f[3], f[4], f[5]);
						break;
					case "Q":
						c.quadraticCurveTo(f[0], f[1], f[2], f[3]);
						break;
					case "A":
						var g = f[0],
							h = f[1],
							i = f[2],
							j = f[3],
							k = f[4],
							l = f[5],
							m = f[6],
							n = f[7],
							o = i > j ? i : j,
							p = i > j ? 1 : i / j,
							q = i > j ? j / i : 1;
						c.translate(g, h), c.rotate(m), c.scale(p, q), c.arc(0, 0, o, k, k + l, 1 - n), c.scale(1 / p, 1 / q), c.rotate(-m), c.translate(-g, -h);
						break;
					case "z":
						c.closePath()
				}
			}
			a.fillStroke(this)
		}
	}, Kinetic.Util.extend(Kinetic.Path, Kinetic.Shape), Kinetic.Path.getLineLength = function(a, b, c, d) {
		return Math.sqrt((c - a) * (c - a) + (d - b) * (d - b))
	}, Kinetic.Path.getPointOnLine = function(a, b, c, d, e, f, g) {
		f === undefined && (f = b), g === undefined && (g = c);
		var h = (e - c) / (d - b + 1e-8),
			i = Math.sqrt(a * a / (1 + h * h));
		d < b && (i *= -1);
		var j = h * i,
			k;
		if ((g - c) / (f - b + 1e-8) === h) k = {
			x: f + i,
			y: g + j
		};
		else {
			var l, m, n = this.getLineLength(b, c, d, e);
			if (n < 1e-8) return undefined;
			var o = (f - b) * (d - b) + (g - c) * (e - c);
			o /= n * n, l = b + o * (d - b), m = c + o * (e - c);
			var p = this.getLineLength(f, g, l, m),
				q = Math.sqrt(a * a - p * p);
			i = Math.sqrt(q * q / (1 + h * h)), d < b && (i *= -1), j = h * i, k = {
				x: l + i,
				y: m + j
			}
		}
		return k
	}, Kinetic.Path.getPointOnCubicBezier = function(a, b, c, d, e, f, g, h, i) {
		function j(a) {
			return a * a * a
		}

		function k(a) {
			return 3 * a * a * (1 - a)
		}

		function l(a) {
			return 3 * a * (1 - a) * (1 - a)
		}

		function m(a) {
			return (1 - a) * (1 - a) * (1 - a)
		}
		var n = h * j(a) + f * k(a) + d * l(a) + b * m(a),
			o = i * j(a) + g * k(a) + e * l(a) + c * m(a);
		return {
			x: n,
			y: o
		}
	}, Kinetic.Path.getPointOnQuadraticBezier = function(a, b, c, d, e, f, g) {
		function h(a) {
			return a * a
		}

		function i(a) {
			return 2 * a * (1 - a)
		}

		function j(a) {
			return (1 - a) * (1 - a)
		}
		var k = f * h(a) + d * i(a) + b * j(a),
			l = g * h(a) + e * i(a) + c * j(a);
		return {
			x: k,
			y: l
		}
	}, Kinetic.Path.getPointOnEllipticalArc = function(a, b, c, d, e, f) {
		var g = Math.cos(f),
			h = Math.sin(f),
			i = {
				x: c * Math.cos(e),
				y: d * Math.sin(e)
			};
		return {
			x: a + (i.x * g - i.y * h),
			y: b + (i.x * h + i.y * g)
		}
	}, Kinetic.Path.parsePathData = function(a) {
		if (!a) return [];
		var b = a,
			c = ["m", "M", "l", "L", "v", "V", "h", "H", "z", "Z", "c", "C", "q", "Q", "t", "T", "s", "S", "a", "A"];
		b = b.replace(new RegExp(" ", "g"), ",");
		for (var d = 0; d < c.length; d++) b = b.replace(new RegExp(c[d], "g"), "|" + c[d]);
		var e = b.split("|"),
			f = [],
			g = 0,
			h = 0;
		for (var d = 1; d < e.length; d++) {
			var i = e[d],
				j = i.charAt(0);
			i = i.slice(1), i = i.replace(new RegExp(",-", "g"), "-"), i = i.replace(new RegExp("-", "g"), ",-"), i = i.replace(new RegExp("e,-", "g"), "e-");
			var k = i.split(",");
			k.length > 0 && k[0] === "" && k.shift();
			for (var l = 0; l < k.length; l++) k[l] = parseFloat(k[l]);
			while (k.length > 0) {
				if (isNaN(k[0])) break;
				var m = null,
					n = [],
					o = g,
					p = h;
				switch (j) {
					case "l":
						g += k.shift(), h += k.shift(), m = "L", n.push(g, h);
						break;
					case "L":
						g = k.shift(), h = k.shift(), n.push(g, h);
						break;
					case "m":
						g += k.shift(), h += k.shift(), m = "M", n.push(g, h), j = "l";
						break;
					case "M":
						g = k.shift(), h = k.shift(), m = "M", n.push(g, h), j = "L";
						break;
					case "h":
						g += k.shift(), m = "L", n.push(g, h);
						break;
					case "H":
						g = k.shift(), m = "L", n.push(g, h);
						break;
					case "v":
						h += k.shift(), m = "L", n.push(g, h);
						break;
					case "V":
						h = k.shift(), m = "L", n.push(g, h);
						break;
					case "C":
						n.push(k.shift(), k.shift(), k.shift(), k.shift()), g = k.shift(), h = k.shift(), n.push(g, h);
						break;
					case "c":
						n.push(g + k.shift(), h + k.shift(), g + k.shift(), h + k.shift()), g += k.shift(), h += k.shift(), m = "C", n.push(g, h);
						break;
					case "S":
						var q = g,
							r = h,
							s = f[f.length - 1];
						s.command === "C" && (q = g + (g - s.points[2]), r = h + (h - s.points[3])), n.push(q, r, k.shift(), k.shift()), g = k.shift(), h = k.shift(), m = "C", n.push(g, h);
						break;
					case "s":
						var q = g,
							r = h,
							s = f[f.length - 1];
						s.command === "C" && (q = g + (g - s.points[2]), r = h + (h - s.points[3])), n.push(q, r, g + k.shift(), h + k.shift()), g += k.shift(), h += k.shift(), m = "C", n.push(g, h);
						break;
					case "Q":
						n.push(k.shift(), k.shift()), g = k.shift(), h = k.shift(), n.push(g, h);
						break;
					case "q":
						n.push(g + k.shift(), h + k.shift()), g += k.shift(), h += k.shift(), m = "Q", n.push(g, h);
						break;
					case "T":
						var q = g,
							r = h,
							s = f[f.length - 1];
						s.command === "Q" && (q = g + (g - s.points[0]), r = h + (h - s.points[1])), g = k.shift(), h = k.shift(), m = "Q", n.push(q, r, g, h);
						break;
					case "t":
						var q = g,
							r = h,
							s = f[f.length - 1];
						s.command === "Q" && (q = g + (g - s.points[0]), r = h + (h - s.points[1])), g += k.shift(), h += k.shift(), m = "Q", n.push(q, r, g, h);
						break;
					case "A":
						var t = k.shift(),
							u = k.shift(),
							v = k.shift(),
							w = k.shift(),
							x = k.shift(),
							y = g,
							z = h;
						g = k.shift(), h = k.shift(), m = "A", n = this.convertEndpointToCenterParameterization(y, z, g, h, w, x, t, u, v);
						break;
					case "a":
						var t = k.shift(),
							u = k.shift(),
							v = k.shift(),
							w = k.shift(),
							x = k.shift(),
							y = g,
							z = h;
						g += k.shift(), h += k.shift(), m = "A", n = this.convertEndpointToCenterParameterization(y, z, g, h, w, x, t, u, v)
				}
				f.push({
					command: m || j,
					points: n,
					start: {
						x: o,
						y: p
					},
					pathLength: this.calcLength(o, p, m || j, n)
				})
			}(j === "z" || j === "Z") && f.push({
				command: "z",
				points: [],
				start: undefined,
				pathLength: 0
			})
		}
		return f
	}, Kinetic.Path.calcLength = function(a, b, c, d) {
		var e, f, g, h = Kinetic.Path;
		switch (c) {
			case "L":
				return h.getLineLength(a, b, d[0], d[1]);
			case "C":
				e = 0, f = h.getPointOnCubicBezier(0, a, b, d[0], d[1], d[2], d[3], d[4], d[5]);
				for (t = .01; t <= 1; t += .01) g = h.getPointOnCubicBezier(t, a, b, d[0], d[1], d[2], d[3], d[4], d[5]), e += h.getLineLength(f.x, f.y, g.x, g.y), f = g;
				return e;
			case "Q":
				e = 0, f = h.getPointOnQuadraticBezier(0, a, b, d[0], d[1], d[2], d[3]);
				for (t = .01; t <= 1; t += .01) g = h.getPointOnQuadraticBezier(t, a, b, d[0], d[1], d[2], d[3]), e += h.getLineLength(f.x, f.y, g.x, g.y), f = g;
				return e;
			case "A":
				e = 0;
				var i = d[4],
					j = d[5],
					k = d[4] + j,
					l = Math.PI / 180;
				Math.abs(i - k) < l && (l = Math.abs(i - k)), f = h.getPointOnEllipticalArc(d[0], d[1], d[2], d[3], i, 0);
				if (j < 0)
					for (t = i - l; t > k; t -= l) g = h.getPointOnEllipticalArc(d[0], d[1], d[2], d[3], t, 0), e += h.getLineLength(f.x, f.y, g.x, g.y), f = g;
				else
					for (t = i + l; t < k; t += l) g = h.getPointOnEllipticalArc(d[0], d[1], d[2], d[3], t, 0), e += h.getLineLength(f.x, f.y, g.x, g.y), f = g;
				return g = h.getPointOnEllipticalArc(d[0], d[1], d[2], d[3], k, 0), e += h.getLineLength(f.x, f.y, g.x, g.y), e
		}
		return 0
	}, Kinetic.Path.convertEndpointToCenterParameterization = function(a, b, c, d, e, f, g, h, i) {
		var j = i * (Math.PI / 180),
			k = Math.cos(j) * (a - c) / 2 + Math.sin(j) * (b - d) / 2,
			l = -1 * Math.sin(j) * (a - c) / 2 + Math.cos(j) * (b - d) / 2,
			m = k * k / (g * g) + l * l / (h * h);
		m > 1 && (g *= Math.sqrt(m), h *= Math.sqrt(m));
		var n = Math.sqrt((g * g * h * h - g * g * l * l - h * h * k * k) / (g * g * l * l + h * h * k * k));
		e == f && (n *= -1), isNaN(n) && (n = 0);
		var o = n * g * l / h,
			p = n * -h * k / g,
			q = (a + c) / 2 + Math.cos(j) * o - Math.sin(j) * p,
			r = (b + d) / 2 + Math.sin(j) * o + Math.cos(j) * p,
			s = function(a) {
				return Math.sqrt(a[0] * a[0] + a[1] * a[1])
			},
			t = function(a, b) {
				return (a[0] * b[0] + a[1] * b[1]) / (s(a) * s(b))
			},
			u = function(a, b) {
				return (a[0] * b[1] < a[1] * b[0] ? -1 : 1) * Math.acos(t(a, b))
			},
			v = u([1, 0], [(k - o) / g, (l - p) / h]),
			w = [(k - o) / g, (l - p) / h],
			x = [(-1 * k - o) / g, (-1 * l - p) / h],
			y = u(w, x);
		return t(w, x) <= -1 && (y = Math.PI), t(w, x) >= 1 && (y = 0), f === 0 && y > 0 && (y -= 2 * Math.PI), f == 1 && y < 0 && (y += 2 * Math.PI), [q, r, g, h, v, y, j, f]
	}, Kinetic.Node.addGetterSetter(Kinetic.Path, "data")
}(),
function() {
	function d(a) {
		a.fillText(this.partialText, 0, 0)
	}

	function e(a) {
		a.strokeText(this.partialText, 0, 0)
	}
	var a = "",
		b = "Calibri",
		c = "normal";
	Kinetic.TextPath = function(a) {
		this._initTextPath(a)
	}, Kinetic.TextPath.prototype = {
		_initTextPath: function(a) {
			var b = this;
			this.createAttrs(), this.dummyCanvas = document.createElement("canvas"), this.dataArray = [], Kinetic.Shape.call(this, a), this._fillFunc = d, this._strokeFunc = e, this.className = "TextPath", this._setDrawFuncs(), this.dataArray = Kinetic.Path.parsePathData(this.attrs.data), this.on("dataChange", function() {
				b.dataArray = Kinetic.Path.parsePathData(this.attrs.data)
			});
			var c = ["text", "textStroke", "textStrokeWidth"];
			for (var f = 0; f < c.length; f++) {
				var g = c[f];
				this.on(g + "Change", b._setTextData)
			}
			b._setTextData()
		},
		drawFunc: function(a) {
			var b = this.charArr,
				c = a.getContext();
			c.font = this._getContextFont(), c.textBaseline = "middle", c.textAlign = "left", c.save();
			var d = this.glyphInfo;
			for (var e = 0; e < d.length; e++) {
				c.save();
				var f = d[e].p0,
					g = d[e].p1,
					h = parseFloat(this.attrs.fontSize);
				c.translate(f.x, f.y), c.rotate(d[e].rotation), this.partialText = d[e].text, a.fillStroke(this), c.restore()
			}
			c.restore()
		},
		getTextWidth: function() {
			return this.textWidth
		},
		getTextHeight: function() {
			return this.textHeight
		},
		setText: function(a) {
			Kinetic.Text.prototype.setText.call(this, a)
		},
		_getTextSize: function(a) {
			var b = this.dummyCanvas,
				c = b.getContext("2d");
			c.save(), c.font = this._getContextFont();
			var d = c.measureText(a);
			return c.restore(), {
				width: d.width,
				height: parseInt(this.attrs.fontSize, 10)
			}
		},
		_setTextData: function() {
			var a = this,
				b = this._getTextSize(this.attrs.text);
			this.textWidth = b.width, this.textHeight = b.height, this.glyphInfo = [];
			var c = this.attrs.text.split(""),
				d, e, f, g = -1,
				h = 0,
				i = function() {
					h = 0;
					var b = a.dataArray;
					for (var c = g + 1; c < b.length; c++) {
						if (b[c].pathLength > 0) return g = c, b[c];
						b[c].command == "M" && (d = {
							x: b[c].points[0],
							y: b[c].points[1]
						})
					}
					return {}
				},
				j = function(b, c) {
					var g = a._getTextSize(b).width,
						j = 0,
						k = 0,
						l = !1;
					e = undefined;
					while (Math.abs(g - j) / g > .01 && k < 25) {
						k++;
						var m = j;
						while (f === undefined) f = i(), f && m + f.pathLength < g && (m += f.pathLength, f = undefined);
						if (f === {} || d === undefined) return undefined;
						var n = !1;
						switch (f.command) {
							case "L":
								Kinetic.Path.getLineLength(d.x, d.y, f.points[0], f.points[1]) > g ? e = Kinetic.Path.getPointOnLine(g, d.x, d.y, f.points[0], f.points[1], d.x, d.y) : f = undefined;
								break;
							case "A":
								var o = f.points[4],
									p = f.points[5],
									q = f.points[4] + p;
								h === 0 ? h = o + 1e-8 : g > j ? h += Math.PI / 180 * p / Math.abs(p) : h -= Math.PI / 360 * p / Math.abs(p), Math.abs(h) > Math.abs(q) && (h = q, n = !0), e = Kinetic.Path.getPointOnEllipticalArc(f.points[0], f.points[1], f.points[2], f.points[3], h, f.points[6]);
								break;
							case "C":
								h === 0 ? g > f.pathLength ? h = 1e-8 : h = g / f.pathLength : g > j ? h += (g - j) / f.pathLength : h -= (j - g) / f.pathLength, h > 1 && (h = 1, n = !0), e = Kinetic.Path.getPointOnCubicBezier(h, f.start.x, f.start.y, f.points[0], f.points[1], f.points[2], f.points[3], f.points[4], f.points[5]);
								break;
							case "Q":
								h === 0 ? h = g / f.pathLength : g > j ? h += (g - j) / f.pathLength : h -= (j - g) / f.pathLength, h > 1 && (h = 1, n = !0), e = Kinetic.Path.getPointOnQuadraticBezier(h, f.start.x, f.start.y, f.points[0], f.points[1], f.points[2], f.points[3])
						}
						e !== undefined && (j = Kinetic.Path.getLineLength(d.x, d.y, e.x, e.y)), n && (n = !1, f = undefined)
					}
				};
			for (var k = 0; k < c.length; k++) {
				j(c[k]);
				if (d === undefined || e === undefined) break;
				var l = Kinetic.Path.getLineLength(d.x, d.y, e.x, e.y),
					m = 0,
					n = Kinetic.Path.getPointOnLine(m + l / 2, d.x, d.y, e.x, e.y),
					o = Math.atan2(e.y - d.y, e.x - d.x);
				this.glyphInfo.push({
					transposeX: n.x,
					transposeY: n.y,
					text: c[k],
					rotation: o,
					p0: d,
					p1: e
				}), d = e
			}
		}
	}, Kinetic.TextPath.prototype._getContextFont = Kinetic.Text.prototype._getContextFont, Kinetic.Util.extend(Kinetic.TextPath, Kinetic.Shape), Kinetic.Node.addGetterSetter(Kinetic.TextPath, "fontFamily", b), Kinetic.Node.addGetterSetter(Kinetic.TextPath, "fontSize", 12), Kinetic.Node.addGetterSetter(Kinetic.TextPath, "fontStyle", c), Kinetic.Node.addGetter(Kinetic.TextPath, "text", a)
}(),
function() {
	Kinetic.RegularPolygon = function(a) {
		this._initRegularPolygon(a)
	}, Kinetic.RegularPolygon.prototype = {
		_initRegularPolygon: function(a) {
			this.createAttrs(), Kinetic.Shape.call(this, a), this.className = "RegularPolygon", this._setDrawFuncs()
		},
		drawFunc: function(a) {
			var b = a.getContext(),
				c = this.attrs.sides,
				d = this.attrs.radius;
			b.beginPath(), b.moveTo(0, 0 - d);
			for (var e = 1; e < c; e++) {
				var f = d * Math.sin(e * 2 * Math.PI / c),
					g = -1 * d * Math.cos(e * 2 * Math.PI / c);
				b.lineTo(f, g)
			}
			b.closePath(), a.fillStroke(this)
		}
	}, Kinetic.Util.extend(Kinetic.RegularPolygon, Kinetic.Shape), Kinetic.Node.addGetterSetter(Kinetic.RegularPolygon, "radius", 0), Kinetic.Node.addGetterSetter(Kinetic.RegularPolygon, "sides", 0)
}(),
function() {
	Kinetic.Star = function(a) {
		this._initStar(a)
	}, Kinetic.Star.prototype = {
		_initStar: function(a) {
			this.createAttrs(), Kinetic.Shape.call(this, a), this.className = "Star", this._setDrawFuncs()
		},
		drawFunc: function(a) {
			var b = a.getContext(),
				c = this.attrs.innerRadius,
				d = this.attrs.outerRadius,
				e = this.attrs.numPoints;
			b.beginPath(), b.moveTo(0, 0 - this.attrs.outerRadius);
			for (var f = 1; f < e * 2; f++) {
				var g = f % 2 === 0 ? d : c,
					h = g * Math.sin(f * Math.PI / e),
					i = -1 * g * Math.cos(f * Math.PI / e);
				b.lineTo(h, i)
			}
			b.closePath(), a.fillStroke(this)
		}
	}, Kinetic.Util.extend(Kinetic.Star, Kinetic.Shape), Kinetic.Node.addGetterSetter(Kinetic.Star, "numPoints", 0), Kinetic.Node.addGetterSetter(Kinetic.Star, "innerRadius", 0), Kinetic.Node.addGetterSetter(Kinetic.Star, "outerRadius", 0)
}(),
function() {
	var a = ["fontFamily", "fontSize", "fontStyle", "padding", "lineHeight", "text"],
		b = "Change.kinetic",
		c = "none",
		d = "up",
		e = "right",
		f = "down",
		g = "left",
		h = "Label",
		i = a.length;
	Kinetic.Label = function(a) {
		this._initLabel(a)
	}, Kinetic.Label.prototype = {
		_initLabel: function(a) {
			var b = this;
			this.createAttrs(), this.className = h, Kinetic.Group.call(this, a), this.on("add", function(a) {
				b._addListeners(a.child), b._sync()
			})
		},
		getText: function() {
			return this.get("Text")[0]
		},
		getTag: function() {
			return this.get("Tag")[0]
		},
		_addListeners: function(c) {
			var d = this,
				e;
			for (e = 0; e < i; e++) c.on(a[e] + b, function() {
				d._sync()
			})
		},
		getWidth: function() {
			return this.getText().getWidth()
		},
		getHeight: function() {
			return this.getText().getHeight()
		},
		_sync: function() {
			var a = this.getText(),
				b = this.getTag(),
				c, h, i, j, k, l;
			if (a && b) {
				c = a.getWidth(), h = a.getHeight(), i = b.getPointerDirection(), j = b.getPointerWidth(), pointerHeight = b.getPointerHeight(), k = 0, l = 0;
				switch (i) {
					case d:
						k = c / 2, l = -1 * pointerHeight;
						break;
					case e:
						k = c + j, l = h / 2;
						break;
					case f:
						k = c / 2, l = h + pointerHeight;
						break;
					case g:
						k = -1 * j, l = h / 2
				}
				b.setAttrs({
					x: -1 * k,
					y: -1 * l,
					width: c,
					height: h
				}), a.setAttrs({
					x: -1 * k,
					y: -1 * l
				})
			}
		}
	}, Kinetic.Util.extend(Kinetic.Label, Kinetic.Group), Kinetic.Tag = function(a) {
		this._initTag(a)
	}, Kinetic.Tag.prototype = {
		_initTag: function(a) {
			this.createAttrs(), Kinetic.Shape.call(this, a), this.className = "Tag", this._setDrawFuncs()
		},
		drawFunc: function(a) {
			var b = a.getContext(),
				c = this.getWidth(),
				h = this.getHeight(),
				i = this.getPointerDirection(),
				j = this.getPointerWidth(),
				k = this.getPointerHeight(),
				l = this.getCornerRadius();
			b.beginPath(), b.moveTo(0, 0), i === d && (b.lineTo((c - j) / 2, 0), b.lineTo(c / 2, -1 * k), b.lineTo((c + j) / 2, 0)), b.lineTo(c, 0), i === e && (b.lineTo(c, (h - k) / 2), b.lineTo(c + j, h / 2), b.lineTo(c, (h + k) / 2)), b.lineTo(c, h), i === f && (b.lineTo((c + j) / 2, h), b.lineTo(c / 2, h + k), b.lineTo((c - j) / 2, h)), b.lineTo(0, h), i === g && (b.lineTo(0, (h + k) / 2), b.lineTo(-1 * j, h / 2), b.lineTo(0, (h - k) / 2)), b.closePath(), a.fillStroke(this)
		}
	}, Kinetic.Util.extend(Kinetic.Tag, Kinetic.Shape), Kinetic.Node.addGetterSetter(Kinetic.Tag, "pointerDirection", c), Kinetic.Node.addGetterSetter(Kinetic.Tag, "pointerWidth", 0), Kinetic.Node.addGetterSetter(Kinetic.Tag, "pointerHeight", 0), Kinetic.Node.addGetterSetter(Kinetic.Tag, "cornerRadius", 0)
}(),
function() {
	Kinetic.Filters.Grayscale = function(a) {
		var b = a.data;
		for (var c = 0; c < b.length; c += 4) {
			var d = .34 * b[c] + .5 * b[c + 1] + .16 * b[c + 2];
			b[c] = d, b[c + 1] = d, b[c + 2] = d
		}
	}
}(),
function() {
	Kinetic.Filters.Brighten = function(a) {
		var b = this.getFilterBrightness(),
			c = a.data;
		for (var d = 0; d < c.length; d += 4) c[d] += b, c[d + 1] += b, c[d + 2] += b
	}, Kinetic.Node.addFilterGetterSetter(Kinetic.Image, "filterBrightness", 0)
}(),
function() {
	Kinetic.Filters.Invert = function(a) {
		var b = a.data;
		for (var c = 0; c < b.length; c += 4) b[c] = 255 - b[c], b[c + 1] = 255 - b[c + 1], b[c + 2] = 255 - b[c + 2]
	}
}(),
function() {
	function a() {
		this.r = 0, this.g = 0, this.b = 0, this.a = 0, this.next = null
	}

	function d(d, e) {
		var f = d.data,
			g = d.width,
			h = d.height,
			i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D, E, F, G = e + e + 1,
			H = g - 1,
			I = h - 1,
			J = e + 1,
			K = J * (J + 1) / 2,
			L = new a,
			M = L,
			N = null,
			O = null,
			P = b[e],
			Q = c[e];
		for (k = 1; k < G; k++) {
			M = M.next = new a;
			if (k == J) var R = M
		}
		M.next = L, o = n = 0;
		for (j = 0; j < h; j++) {
			x = y = z = A = p = q = r = s = 0, t = J * (B = f[n]), u = J * (C = f[n + 1]), v = J * (D = f[n + 2]), w = J * (E = f[n + 3]), p += K * B, q += K * C, r += K * D, s += K * E, M = L;
			for (k = 0; k < J; k++) M.r = B, M.g = C, M.b = D, M.a = E, M = M.next;
			for (k = 1; k < J; k++) l = n + ((H < k ? H : k) << 2), p += (M.r = B = f[l]) * (F = J - k), q += (M.g = C = f[l + 1]) * F, r += (M.b = D = f[l + 2]) * F, s += (M.a = E = f[l + 3]) * F, x += B, y += C, z += D, A += E, M = M.next;
			N = L, O = R;
			for (i = 0; i < g; i++) f[n + 3] = E = s * P >> Q, E != 0 ? (E = 255 / E, f[n] = (p * P >> Q) * E, f[n + 1] = (q * P >> Q) * E, f[n + 2] = (r * P >> Q) * E) : f[n] = f[n + 1] = f[n + 2] = 0, p -= t, q -= u, r -= v, s -= w, t -= N.r, u -= N.g, v -= N.b, w -= N.a, l = o + ((l = i + e + 1) < H ? l : H) << 2, x += N.r = f[l], y += N.g = f[l + 1], z += N.b = f[l + 2], A += N.a = f[l + 3], p += x, q += y, r += z, s += A, N = N.next, t += B = O.r, u += C = O.g, v += D = O.b, w += E = O.a, x -= B, y -= C, z -= D, A -= E, O = O.next, n += 4;
			o += g
		}
		for (i = 0; i < g; i++) {
			y = z = A = x = q = r = s = p = 0, n = i << 2, t = J * (B = f[n]), u = J * (C = f[n + 1]), v = J * (D = f[n + 2]), w = J * (E = f[n + 3]), p += K * B, q += K * C, r += K * D, s += K * E, M = L;
			for (k = 0; k < J; k++) M.r = B, M.g = C, M.b = D, M.a = E, M = M.next;
			m = g;
			for (k = 1; k <= e; k++) n = m + i << 2, p += (M.r = B = f[n]) * (F = J - k), q += (M.g = C = f[n + 1]) * F, r += (M.b = D = f[n + 2]) * F, s += (M.a = E = f[n + 3]) * F, x += B, y += C, z += D, A += E, M = M.next, k < I && (m += g);
			n = i, N = L, O = R;
			for (j = 0; j < h; j++) l = n << 2, f[l + 3] = E = s * P >> Q, E > 0 ? (E = 255 / E, f[l] = (p * P >> Q) * E, f[l + 1] = (q * P >> Q) * E, f[l + 2] = (r * P >> Q) * E) : f[l] = f[l + 1] = f[l + 2] = 0, p -= t, q -= u, r -= v, s -= w, t -= N.r, u -= N.g, v -= N.b, w -= N.a, l = i + ((l = j + J) < I ? l : I) * g << 2, p += x += N.r = f[l], q += y += N.g = f[l + 1], r += z += N.b = f[l + 2], s += A += N.a = f[l + 3], N = N.next, t += B = O.r, u += C = O.g, v += D = O.b, w += E = O.a, x -= B, y -= C, z -= D, A -= E, O = O.next, n += g
		}
	}
	var b = [512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512, 454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512, 482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456, 437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512, 497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328, 320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456, 446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335, 329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512, 505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405, 399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328, 324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271, 268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456, 451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388, 385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335, 332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292, 289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259],
		c = [9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24];
	Kinetic.Filters.Blur = function(a) {
		var b = this.getFilterRadius() | 0;
		b > 0 && d(a, b)
	}, Kinetic.Node.addFilterGetterSetter(Kinetic.Image, "filterRadius", 0)
}(),
function() {
	function a(a, b, c) {
		var d = (c * a.width + b) * 4,
			e = [];
		return e.push(a.data[d++], a.data[d++], a.data[d++], a.data[d++]), e
	}

	function b(a, b) {
		return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2))
	}

	function c(a) {
		var b = [0, 0, 0];
		for (var c = 0; c < a.length; c++) b[0] += a[c][0], b[1] += a[c][1], b[2] += a[c][2];
		return b[0] /= a.length, b[1] /= a.length, b[2] /= a.length, b
	}

	function d(d, e) {
		var f = a(d, 0, 0),
			g = a(d, d.width - 1, 0),
			h = a(d, 0, d.height - 1),
			i = a(d, d.width - 1, d.height - 1),
			j = e || 10;
		if (b(f, g) < j && b(g, i) < j && b(i, h) < j && b(h, f) < j) {
			var k = c([g, f, i, h]),
				l = [];
			for (var m = 0; m < d.width * d.height; m++) {
				var n = b(k, [d.data[m * 4], d.data[m * 4 + 1], d.data[m * 4 + 2]]);
				l[m] = n < j ? 0 : 255
			}
			return l
		}
	}

	function e(a, b) {
		for (var c = 0; c < a.width * a.height; c++) a.data[4 * c + 3] = b[c]
	}

	function f(a, b, c) {
		var d = [1, 1, 1, 1, 0, 1, 1, 1, 1],
			e = Math.round(Math.sqrt(d.length)),
			f = Math.floor(e / 2),
			g = [];
		for (var h = 0; h < c; h++)
			for (var i = 0; i < b; i++) {
				var j = h * b + i,
					k = 0;
				for (var l = 0; l < e; l++)
					for (var m = 0; m < e; m++) {
						var n = h + l - f,
							o = i + m - f;
						if (n >= 0 && n < c && o >= 0 && o < b) {
							var p = n * b + o,
								q = d[l * e + m];
							k += a[p] * q
						}
					}
				g[j] = k === 2040 ? 255 : 0
			}
		return g
	}

	function g(a, b, c) {
		var d = [1, 1, 1, 1, 1, 1, 1, 1, 1],
			e = Math.round(Math.sqrt(d.length)),
			f = Math.floor(e / 2),
			g = [];
		for (var h = 0; h < c; h++)
			for (var i = 0; i < b; i++) {
				var j = h * b + i,
					k = 0;
				for (var l = 0; l < e; l++)
					for (var m = 0; m < e; m++) {
						var n = h + l - f,
							o = i + m - f;
						if (n >= 0 && n < c && o >= 0 && o < b) {
							var p = n * b + o,
								q = d[l * e + m];
							k += a[p] * q
						}
					}
				g[j] = k >= 1020 ? 255 : 0
			}
		return g
	}

	function h(a, b, c) {
		var d = [1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9],
			e = Math.round(Math.sqrt(d.length)),
			f = Math.floor(e / 2),
			g = [];
		for (var h = 0; h < c; h++)
			for (var i = 0; i < b; i++) {
				var j = h * b + i,
					k = 0;
				for (var l = 0; l < e; l++)
					for (var m = 0; m < e; m++) {
						var n = h + l - f,
							o = i + m - f;
						if (n >= 0 && n < c && o >= 0 && o < b) {
							var p = n * b + o,
								q = d[l * e + m];
							k += a[p] * q
						}
					}
				g[j] = k
			}
		return g
	}
	Kinetic.Filters.Mask = function(a) {
		var b = this.getFilterThreshold(),
			c = d(a, b);
		return c && (c = f(c, a.width, a.height), c = g(c, a.width, a.height), c = h(c, a.width, a.height), e(a, c)), a
	}, Kinetic.Node.addFilterGetterSetter(Kinetic.Image, "filterThreshold", 0)
}();
