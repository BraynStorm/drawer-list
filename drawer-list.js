/**
 * Created by Braynstorm on 7.4.2016 г..
 */
'use strict';

class Drawer {
	constructor (holder, elementClasses, title) {
		this.scrollInfo = {
			currentPx        : 0,
			currentPercentage: 0,
			totalPx          : 0,

			scrollbarHeight    : 0,
			scrollbarMeatHeight: 0,
			scrollbarArea      : 0

		};

		this.holder           = holder;
		this.holder.innerHTML = "";
		this.holder.classList.add("drawer");

		this.drawerTitle           = $createDiv({'class': "drawer-title"});
		this.drawerTitle.innerHTML = title;
		this.drawerElementsHolder  = $createDiv({'class': "drawer-elements-holder"});
		this.drawerElements        = $createDiv({'class': "drawer-elements"});
		this.scrollbar             = $createDiv({'class': "drawer-scrollbar"});
		this.scrollbarMeat         = $createDiv({'class': "drawer-scrollbar-meat"});

		this.mouseScrolling = false;

		this.drawerTitle.showHideAnimation = new Animation(this.holder, "height", 20, 200, () => this.drawerTitle.classList.toggle("drawer-closed"));

		this.drawerTitle.addEventListener("mousedown", (e) => {
			if(e.button == 0)
				this.drawerTitle.showHideAnimation.go();
		});


		this.drawerElementsHolder.addEventListener("wheel", (e) => {
			if(!this.mouseScrolling){
				this.scrollByPx(e.deltaY * 10);
				e.preventDefault();
			}
		});

		this.scrollbarMeat.addEventListener("mousedown", (e) => {
			if(e.button == 0)
				this.mouseScrolling = true;
		});

		document.addEventListener("mouseup", (e) => {
			this.mouseScrolling = false;
		});

		document.addEventListener("mousemove", (e) => {
			if (this.mouseScrolling) {
				this.scrollToPct((e.pageY - this.scrollbar.getBoundingClientRect().top - 10) / (this.scrollInfo.scrollbarArea));

				e.preventDefault();
			}
		});

		this.scrollbar.appendChild(this.scrollbarMeat);
		this.drawerElementsHolder.appendChild(this.drawerElements);

		this.holder.appendChild(this.drawerTitle);
		this.holder.appendChild(this.drawerElementsHolder);
		this.holder.appendChild(this.scrollbar);

		this.list = new Set();

		this.elementClasses = elementClasses;
		this.elementClasses.push("drawer-element");

		this.remakeHtml();
	}

	scrollToPct (percentage) {
		this.scrollInfo.currentPercentage = Utils.clamp(percentage, 0, 1);
		this.scrollInfo.currentPx         = this.scrollInfo.currentPercentage * (this.scrollInfo.totalPx + 6);


		var newMeatTop = this.scrollInfo.currentPercentage * this.scrollInfo.scrollbarArea;
		this.scrollbarMeat.style.top        = newMeatTop + 'px';

		var newBorderRadius = this.scrollInfo.scrollbarArea - newMeatTop;

		if(newBorderRadius <= 5)
			this.scrollbarMeat.style.borderBottomRightRadius = 5 - newBorderRadius + 'px';
		else
			this.scrollbarMeat.style.borderBottomRightRadius = '0px';


		this.drawerElementsHolder.scrollTop = this.scrollInfo.currentPx;
	}

	scrollByPx (amount) {
		this.scrollToPx(this.scrollInfo.currentPx + amount);
	}

	scrollToPx (px) {
		px = Utils.clamp(px, 0, this.scrollInfo.totalPx);
		this.scrollToPct(px / this.scrollInfo.totalPx);
	}

	addElement (text) {
		this.list.add(this.makeElement(text));

		this.remakeHtml();
	}

	addElements (elementsTextArray) {
		for (var i in elementsTextArray) {
			this.list.add(this.makeElement(elementsTextArray[i]));
		}

		this.remakeHtml();
	}


	empty(){
		this.list = new Set();
	}

	remakeHtml () {
		this.drawerElements.innerHTML = "";

		this.list.forEach(element => {
			this.drawerElements.appendChild(element);
		});

		var holderH                         = getComputedStyle(this.drawerElementsHolder, null).height;
		var elementsH                       = getComputedStyle(this.drawerElements, null).height;
		this.scrollInfo.totalPx             = Utils.stripPx(elementsH) - Utils.stripPx(holderH);
		this.scrollInfo.scrollbarHeight     = Utils.stripPx(getComputedStyle(this.scrollbar, null).height);
		this.scrollInfo.scrollbarMeatHeight = Utils.stripPx(getComputedStyle(this.scrollbarMeat, null).height);
		this.scrollInfo.scrollbarArea       = this.scrollInfo.scrollbarHeight - this.scrollInfo.scrollbarMeatHeight;
	}

	makeElement (text) {
		var elem = $createDiv({"class" : this.elementClasses.join(' ')});
		elem.innerHTML = text;
		return elem;
	}
}