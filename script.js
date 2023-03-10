//made with: https://codepen.io/badurski

function map(number, minin, maxin, minout, maxout) {
	return (number - minin) * (maxout - minout) / (maxin - minin) + minout;
}

function degToRad(deg) {
	return deg * Math.PI / 180;
}

function pointOnCircle(deg, c, r, startAngle = 0) {
	if(!c instanceof Object) return false;

	return {x: c.x + r * Math.cos(degToRad(deg + startAngle)), y: c.y + r * Math.sin(degToRad(deg + startAngle))};
}

class BezierCurve {

	constructor(x, y, x1, y1, x2, y2, k = 100) {
		this.x = x;
		this.y = y;
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.k = k;
	}

	calculate(arg1, arg2, arg3, t) {
		return (1 - t) * (1 - t) * arg1 + 2 * (1 - t) * t * arg2 + t * t * arg3;
	}

	calculateX(t) {
		return this.calculate(this.x, this.x1, this.x2, t)
	}

	calculateY(t) {
		return this.calculate(this.y, this.y1, this.y2, t);
	}

	getPoints() {
		let points = [];
		for(let i = 0; i < this.k; i++) {
			points.push({x: this.calculateX(i/this.k), y: this.calculateY(i/this.k)});
		}
		return points;
	}

}

class VolumeCatapult {
  constructor(element) {
    this.element = document.querySelector(element);
    this.children = [];
		this.handler = 0;
		this.maxDuration = 1000;
		
		this._charge = 0;

		this.locked = false;
		this.secure = false;
		this.max_angle = 0.5;
		this.init();
  }

	get value() {
		return this.input.value;
	}

	charge() {

		if (this.locked) return false;
		this.secure = true;

    this.handler.style.visibility = 'hidden';
    this.handler.style.opacity = '0';

		let now = Date.now();
		this.i = setInterval(() => {
			let interval = Date.now() - now;
			this._charge = interval < 50 ? 0 : map(interval, 0, this.maxDuration, 0, 100);

			this.icon.style.transform = `rotate(${-this._charge/(20/9)}deg)`;

			if(Date.now() - now >= this.maxDuration) {

				clearInterval(this.i);
				this._charge = 100;
				this.icon.style.transform = 'rotate(-45deg)';
				this.i = undefined;

 			}

		}, 5);

	}

	release(charge) {
		if(this.locked || !this.secure) return false;

    this.locked = true;
		this.input.value = this._charge;

		let width = this.slider.offsetWidth;

    if (this.i != "undefined") clearInterval(this.i);
		this.handler.style.transform = `translate(${pointOnCircle(charge/(20/9) * 2, {x: 0, y: 0}, 17.5).x - 16}px, ${-pointOnCircle(charge/(20/9) * 2, {x: 0, y: 0}, 17.5).y}px)`;
		this.handler.style.visibility = 'visible';
    this.handler.style.opacity = '1';

		if(charge == 0) {
			this.locked = false;
			this.secure = false;
			return false;
		}

    this.j = setInterval(() => {

	    this.icon.style.transform = `rotate(${-charge/2.2}deg)`;
	    charge -= charge*0.1;

	    if(charge <= .5) {

	      clearInterval(this.j);
	      this.icon.style.transform = 'rotate(0deg)';
	      charge = 0;

	    }

    }, 5);

		let curve = new BezierCurve(pointOnCircle(charge/(20/9) * 2, {x: 0, y: 0}, 17.5).x - 16, -pointOnCircle(charge/(20/9) * 2, {x: 0, y: 0}, 17.5).y, map(charge, 0, 100, 0, 250)/2, -map(charge, 0, 100, 0, 125), map(charge, 0, 100, 0, 250), 0, map(charge, 0, 100, 0, 50));
		let i = 0;
		let points = curve.getPoints();

		this.k = setInterval(() => {
			if(i == points.length) {
				clearInterval(this.k);
				this.locked = false;
				this.handler.style.transform = `translate(${curve.x2}px, ${curve.y2}px)`;
				this.secure = false;
				return true;
			}
			this.handler.style.transform = `translate(${points[i].x}px, ${points[i].y}px)`;
			i++;
		}, 1000/60);
	}

  // Build a control
  build() {
    let wu__svc__icon = this.new_element('div', {class: 'wu__svc__icon'}, '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 115.3 115.3"><path d="M47.9,14.306L26,30.706H6c-3.3,0-6,2.7-6,6v41.8c0,3.301,2.7,6,6,6h20l21.9,16.4c4,3,9.6,0.2,9.6-4.8v-77 C57.5,14.106,51.8,11.306,47.9,14.306z"></path> <path d="M77.3,24.106c-2.7-2.7-7.2-2.7-9.899,0c-2.7,2.7-2.7,7.2,0,9.9c13,13,13,34.101,0,47.101c-2.7,2.7-2.7,7.2,0,9.899 c1.399,1.4,3.199,2,4.899,2s3.601-0.699,4.9-2.1C95.8,72.606,95.8,42.606,77.3,24.106z"></path> <path d="M85.1,8.406c-2.699,2.7-2.699,7.2,0,9.9c10.5,10.5,16.301,24.4,16.301,39.3s-5.801,28.8-16.301,39.3 c-2.699,2.7-2.699,7.2,0,9.9c1.4,1.399,3.2,2.1,4.9,2.1c1.8,0,3.6-0.7,4.9-2c13.1-13.1,20.399-30.6,20.399-49.2 c0-18.6-7.2-36-20.399-49.2C92.3,5.706,87.9,5.706,85.1,8.406z"></path></svg>');
    let wu__svc__trajectory = this.new_element('div', {class: 'wu__svc__trajectory'});
    let wu__svc__slider = this.new_element('div', {class: 'wu__svc__slider'});
    let wu__svc__slider__handle = this.new_element('div', {class: 'wu_svc__slider__handle'});
    let wu__svc__input = this.new_element('input', {type: 'hidden', name: 'volume', id: 'volume-input'});
    // append the handler to slider line

		this.handler = wu__svc__slider__handle;
    wu__svc__slider.append(wu__svc__slider__handle);
    wu__svc__slider.append(wu__svc__input);
		this.input = wu__svc__input;
    // append all childrens to main element
		this.icon = wu__svc__icon;
    this.children.push(wu__svc__icon);
    this.element.append(wu__svc__icon);
    // -----------------------------------
		this.trajectory = wu__svc__trajectory;
    this.children.push(wu__svc__trajectory);
    this.element.append(wu__svc__trajectory);
    // -----------------------------------
		this.slider = wu__svc__slider;
    this.children.push(wu__svc__slider);
    this.element.append(wu__svc__slider);
    // -----------------------------------
  }

  /**
   * Creating new elements
   * @param  {string} element
   * @param  {object} attrs
   * @param  {string} content
   */
  new_element(element, attrs, content) {
    let _element = document.createElement(element);
    for (var key in attrs) _element.setAttribute(key, attrs[key]);
    if (content) _element.innerHTML = content;
    return _element;
  }

  // Initialize
  init() {
		this.build();
		this.icon.addEventListener('mousedown', () => this.charge());
		this.icon.addEventListener('mouseup', () => this.release(this._charge));
		this.icon.addEventListener('mouseleave', () => this.release(this._charge));
		this.icon.addEventListener('touchstart', () => this.charge());
		this.icon.addEventListener('touchend', () => this.release(this._charge));
		this.icon.addEventListener('touchleave', () => this.release(this._charge));
  }
}

const vc = new VolumeCatapult('.wu__svc');