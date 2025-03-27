// class to create cards

class Card {
  constructor(containerId, id, icons, title, amount, indicator) {
    this.id = id;
    const container = document.getElementById(containerId);
    const div = document.createElement('div');
    div.setAttribute(
      'class',
      'rounded-xl border-1 border-[#a6a6a6] p-2 shadow-md  w-full flex-shrink-0 snap-center'
    );

    const iconUp = 'fa-solid fa-arrow-up text-green-500';
    const iconDown = 'fa-solid fa-arrow-down text-red-500';

    const indicatorElement =
      indicator !== null
        ? `<div class="container w-19 h-8 pt-0.5 flex justify-center rounded-2xl bg-success-bg font-bold text-success-text">
        <i class="${iconUp}"></i>
        <span><span id="${id}-indicator">${indicator}</span>%</span>
        </div>`
        : '';

    div.innerHTML = `<div class="flex flex-1 justify-between ">
            <span class="border-1 rounded-full text-xl text-center text-border w-8 h-8">
              <i class="${icons[0]}"></i>
            </span>
            <button class="text-border cursor-pointer ${icons[1]}">
            </button>
          </div>
          <h2 class="text-text-secondary font-semibold text-lg">${title}</h2>
          <div class="flex justify-between">
            <span class="text-2xl font-bold text-text" id="current-total-amount">S/. <span id="${id}-amount">${amount}</span></span>
            ${indicatorElement}
        </div>`;

    container.appendChild(div);
  }

  update(amount, indicator) {
    const amountElement = document.getElementById(this.id + '-amount');
    const indicatorElement = document.getElementById(this.id + '-indicator');

    amountElement.innerHTML = amount;
    if (indicatorElement) indicatorElement.innerHTML = indicator;
  }
}

export { Card };
