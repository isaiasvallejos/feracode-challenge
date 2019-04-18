export const purchasesView = {
  map: String(function(document) {
    if (document.type != 'purchase') {
      return false
    }

    emit(document.variantId, {
      quantity: document.quantity,
      date: document.date
    })
  }),
  reduce: String(function(keys, values, rereduce) {
    return values
  })
}
