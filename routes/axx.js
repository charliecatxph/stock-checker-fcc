if (data === null) {
  if (req_like[0] === 'true') {
    const new_stock = new Stock({
      stock: stocks[i].symbol,
      likes: [encrypt_ip]
    });

    new_stock.save().then(d => {
      output.push(d)
    });
  } else {
    const new_stock = new Stock({
      stock: stocks[i].symbol
    });

    new_stock.save().then(d => {
      output.push(d)
    });
  }
} else {
  if (req_like[0] === 'true') {
    for (let j = 0; j < data.likes.length; j++) {
      if (bcrypt.compareSync(req.ip, data.likes[j])) {
        output.push(data)
      }
      return;
    }

    data.likes.push(encrypt_ip);
    data.save().then(d => {
      output.push(d)
    });
  }
}