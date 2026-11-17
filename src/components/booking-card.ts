import type { Booking } from '../models/booking'

export class BookingCard extends HTMLElement {
  private current: Booking | null = null
  private nameText = document.createElement('h3')
  private seatsText = document.createElement('p')
  private statusText = document.createElement('p')
  private groupText = document.createElement('p')
  private button = document.createElement('button')

  constructor() {
    super()
    const style = document.createElement('style')
    style.textContent = `
      :host { display: block; min-width: 0; font-family: inherit; }
      article { border: 1px solid #c5d7d0; border-radius: 12px; padding: 16px; background: white; color: #203a34; }
      h3 { margin: 0 0 8px; overflow-wrap: anywhere; }
      p { margin: 6px 0; }
      /* П6: замените фон внутренней кнопки на CSS-переменную с запасным цветом. */
      button { background: var(--booking-accent, #355bd4); color: white; border: 0; border-radius: 6px; padding: 9px 14px; font: inherit; cursor: pointer; }      button:disabled { background: #dfe6e3; color: #52665e; cursor: default; }
      button:focus-visible { outline: 3px solid #a15c00; outline-offset: 3px; }
    `
    const article = document.createElement('article')
    this.button.type = 'button'
    article.append(this.nameText, this.seatsText, this.statusText, this.groupText, this.button)
    const root = this.attachShadow({ mode: 'open' })
    root.append(style, article)
    this.render()
  }

  set booking(value: Booking) {
    this.current = value
    this.render()
  }

  private render() {
    const booking = this.current
    if (!booking) {
      this.nameText.textContent = 'Ожидаю данные'
      this.seatsText.textContent = ''
      this.statusText.textContent = ''
      this.groupText.textContent = ''
      this.button.textContent = 'Подтвердить'
      this.button.disabled = true
      return
    }
    this.nameText.textContent = booking.name
    this.seatsText.textContent = `Участников: ${booking.seats}`
    this.statusText.textContent = booking.status === 'confirmed' ? 'Подтверждена' : 'Новая заявка';
    this.button.textContent = booking.status === 'confirmed' ? 'Подтверждено' : 'Подтвердить';
    this.button.disabled = booking.status === 'confirmed' ? true : false;
    // П10: выведите «Индивидуально» или «Группа» в groupText.
  }

  private onConfirm = () => {
    if (!this.current || this.current.status === 'confirmed') return
    // П7: отправьте booking-confirm от this с detail.id и bubbles: true.
  }

  connectedCallback() {
    // П7: подключите this.onConfirm к click внутренней кнопки.
  }

  disconnectedCallback() {
    // П8: снимите тот же обработчик.
  }
}

customElements.define('booking-card', BookingCard)
