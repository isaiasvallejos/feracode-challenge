export const updateStock = String(function(document, request) {
  if (!document) {
    return [
      null,
      {
        code: 404,
        json: {
          statusCode: 404,
          data: { ok: false, error: 'not_found', message: 'missing' }
        }
      }
    ]
  } else {
    var body = JSON.parse(request.body)
    var quantity = parseInt(body.quantity)

    document['quantity'] = quantity

    if (quantity > 0) {
      document['stock'] = 'available'
    } else {
      document['stock'] = 'unavailable'
    }

    return [
      document,
      {
        code: 200,
        json: {
          ok: true,
          id: document._id
        }
      }
    ]
  }
})

export const updateStockOnPurchase = String(function(document, request) {
  if (!document || document['disabled']) {
    return [
      null,
      {
        code: 404,
        json: {
          ok: false,
          error: 'not_found',
          message: 'missing'
        }
      }
    ]
  } else {
    var body = JSON.parse(request.body)
    var quantity = document['quantity']
    var purchased = parseInt(body.quantity)

    if (quantity < purchased) {
      return [
        null,
        {
          code: 422,
          json: {
            ok: false,
            error: 'unprocessable',
            message: 'out of stock'
          }
        }
      ]
    }

    var currentPurchased = document['purchased'] || 0

    document['purchased'] = currentPurchased + purchased
    document['quantity'] = quantity - purchased

    if (document['quantity'] == 0) {
      document['stock'] = 'unavailable'
    }

    return [
      document,
      {
        code: 200,
        json: {
          ok: true,
          id: document._id
        }
      }
    ]
  }
})

export const updateStockPrediction = String(function(document, request) {
  if (!document || document['disabled']) {
    return [
      null,
      {
        code: 404,
        json: {
          ok: false,
          error: 'not_found',
          message: 'missing'
        }
      }
    ]
  } else {
    var body = JSON.parse(request.body)
    var prediction = body.prediction
    var now = new Date().getTime()
    var soldOutIn = +(prediction - now).toFixed(0)
    var currentSoldOutIn = document['soldOutIn']
    var quantity = document['quantity']

    if (currentSoldOutIn >= 0) {
      if (soldOutIn > 0 && quantity > 0) {
        document['stock'] = 'available'
        document['soldOutIn'] = soldOutIn
      } else if (quantity > 0) {
        document['stock'] = 'stagnant'
        document['soldOutIn'] = 0
      } else {
        document['soldOutIn'] = 0
      }
    } else {
      document['soldOutIn'] = 0
    }

    return [
      document,
      {
        code: 200,
        json: {
          ok: true,
          id: document._id
        }
      }
    ]
  }
})
