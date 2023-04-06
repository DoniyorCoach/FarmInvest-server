class ProductDTO {
  id;
  count;
  name;
  income;

  constructor(model) {
    this.id = model;
    this.count = 0;
    this.name = '';
    this.income = 0;
  }
}

module.exports = ProductDTO;
