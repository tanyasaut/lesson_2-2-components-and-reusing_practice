import './style.css'
import type { Booking } from './models/booking'
import { initialBookings } from './models/booking'
import { legacyCard, updateLegacy } from './legacy-card'
import { mountLab } from './lab'
import './components/booking-card'
// П9: здесь импортируйте тип BookingCard.

const app = document.querySelector<HTMLDivElement>('#app')!
app.innerHTML = `
  <main>
    <header><p class="eyebrow">ВЕБ-МАСТЕРСКАЯ · ПРАКТИКА 2/2</p><h1>Одна карточка, два списка</h1>
      <p>Внизу работает обычный интерфейс. В лаборатории соберите его замену.</p></header>
    <section class="panel" aria-labelledby="lab-title"><h2 id="lab-title">Лаборатория карточки</h2><div id="lab"></div></section>
    <section class="panel"><h2>Новая заявка</h2>
      <form id="form" novalidate><label>Имя<input name="name" autocomplete="given-name"></label>
      <label>Участников<input name="seats" type="text" inputmode="numeric" value="1"></label>
      <button>Добавить заявку</button><p id="message" role="status"></p></form></section>
    <p class="summary">Участников: <strong id="total">0</strong> · Получено событий: <strong id="events">0</strong></p>
    <div id="lists" class="columns">
      <section><h2>Все заявки</h2><div id="all" class="cards"></div></section>
      <section><h2>Подтверждённые</h2><div id="confirmed" class="cards"></div></section>
    </div>
    <footer>Обновление страницы возвращает исходные заявки и сбрасывает лабораторию.</footer>
  </main>`
let bookings = initialBookings()
const all = document.querySelector<HTMLElement>('#all')!
const confirmed = document.querySelector<HTMLElement>('#confirmed')!
const total = document.querySelector<HTMLElement>('#total')!
const events = document.querySelector<HTMLElement>('#events')!
const lists = document.querySelector<HTMLElement>('#lists')!
const form = document.querySelector<HTMLFormElement>('#form')!
const message = document.querySelector<HTMLElement>('#message')!
let received = 0

function makeCard(booking: Booking): HTMLElement {
  // П9: замените тело функции созданием booking-card и передачей booking.
  return legacyCard(booking, confirmBooking)
}
function updateCard(card: HTMLElement, booking: Booking) {
  // П9: замените тело повторным присваиванием свойства booking.
  updateLegacy(card, booking)
}

// Синхронизация уже готова: сохраняет существующие элементы по id.
const allCards = new Map<string, HTMLElement>()
const confirmedCards = new Map<string, HTMLElement>()
function sync(target: HTMLElement, cards: Map<string, HTMLElement>, rows: Booking[]) {
  for (const [id, card] of cards) {
    if (!rows.some(row => row.id === id)) { card.remove(); cards.delete(id) }
  }
  for (const booking of rows) {
    let card = cards.get(booking.id)
    if (!card) { card = makeCard(booking); cards.set(booking.id, card) }
    updateCard(card, booking)
    if (card.parentElement !== target) target.append(card)
  }
}
function renderLists() {
  sync(all, allCards, bookings)
  sync(confirmed, confirmedCards, bookings.filter(row => row.status === 'confirmed'))
  total.textContent = String(bookings.reduce((sum, row) => sum + row.seats, 0))
  events.textContent = String(received)
}
function confirmBooking(id: string) {
  bookings = bookings.map(row => row.id === id ? { ...row, status: 'confirmed' } : row)
  renderLists()
}
lists.addEventListener('booking-confirm', (event) => {
  if (!(event instanceof CustomEvent) || typeof event.detail?.id !== 'string') return
  const id: string = event.detail.id
  if (!bookings.some(row => row.id === id && row.status === 'new')) return
  received += 1
  events.textContent = String(received)
  // П9: передайте id готовой функции confirmBooking.
})
form.addEventListener('submit', (event) => {
  event.preventDefault()
  const data = new FormData(form)
  const name = data.get('name')
  const raw = data.get('seats')
  if (typeof name !== 'string' || name.trim() === '') { message.textContent = 'Укажите имя.'; return }
  const seats = typeof raw === 'string' && raw.trim() !== '' ? Number(raw) : NaN
  if (!Number.isInteger(seats) || seats < 1 || seats > 5) {
    message.textContent = 'Введите целое число участников от 1 до 5.'; return
  }
  bookings.push({ id: crypto.randomUUID(), name: name.trim(), seats, status: 'new', source: 'web' })
  renderLists(); form.reset(); message.textContent = 'Заявка добавлена.'
})
mountLab(document.querySelector<HTMLElement>('#lab')!)
renderLists()
