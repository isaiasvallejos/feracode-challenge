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
    document['stock'] = { quantity: quantity }

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
  if (!document) {
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
    var quantity = document['stock']['quantity']
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

    document['stock']['quantity'] = quantity - purchased

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
  if (!document) {
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
    var endsIn = new Date(body.endsIn)

    document['stock']['endsIn'] = endsIn

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
