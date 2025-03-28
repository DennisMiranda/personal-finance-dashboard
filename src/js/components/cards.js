// class to create cards

class Card {
  constructor(containerId, id, icons, title, amount, indicator) {
    this.containerId = containerId;
    this.id = id;
    this.icons = icons;
    this.title = title;
    this.amount = amount;
    this.indicator = indicator;
  }

  init() {
    const container = document.getElementById(this.containerId);
    const div = document.createElement('div');
    div.setAttribute(
      'class',
      'rounded-xl p-2 border border-gray-200 shadow-[0px_4px_10px_rgba(47,44,216,0.25)]  w-full flex-shrink-0 snap-center'
    );

    const indicatorElement = this.createIndicatorElement(this.indicator);

    div.innerHTML = `<div class="flex flex-1 justify-between ">
            <span class="border-1 rounded-full text-xl text-center text-border w-8 h-8">
              <i class="${this.icons[0]}"></i>
            </span>
            <button class="text-border ${this.icons[1]}">
            </button>
          </div>
          <h2 class="text-text-secondary font-semibold text-lg">${this.title}</h2>
          <div class="flex justify-between">
            <span class="text-2xl font-bold text-text" id="current-total-amount">S/. <span id="${this.id}-amount">${this.amount}</span></span>
            ${indicatorElement}
        </div>`;

    container.appendChild(div);
  }

  update(amount, indicator) {
    const amountElement = document.getElementById(this.id + '-amount');
    const indicatorElement = document.getElementById(
      this.id + '-indicator-container'
    );

    amountElement.innerHTML = amount;
    if (indicatorElement) {
      indicatorElement.innerHTML = this.createIndicatorElement(indicator);
    }
  }

  createIndicatorElement(indicator) {
    const iconUp = 'fa-solid fa-arrow-up text-green-500';
    const iconDown = 'fa-solid fa-arrow-down text-red-500';
    const classDivUp = 'bg-success-bg text-success-text';
    const classDivDown = 'bg-danger-bg text-danger-text';

    return indicator !== null
      ? `<div id="${
          this.id
        }-indicator-container" class="container w-19 h-8 p-1 flex justify-center items-center rounded-2xl font-bold text-sm gap-1 ${
          indicator >= 0 ? classDivUp : classDivDown
        } ">
        <i class="${indicator >= 0 ? iconUp : iconDown} text-xs"></i>
        <span><span id="${this.id}-indicator">${indicator}</span>%</span>
        </div>`
      : '';
  }
}

export { Card };
