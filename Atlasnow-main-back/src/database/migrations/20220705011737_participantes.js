exports.up = function (knex) {
  return knex.schema.createTable('participantes', table => {
    table.increments('id')
    table.string('funcionarioCPF').notNullable()
    table.integer('ataId', 10).unsigned().notNullable()

    table.foreign('funcionarioCPF').references('CPF').inTable('funcionarios')
    table.foreign('ataId').references('id').inTable('atas');


    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
};


exports.down = function (knex) {
  return knex.schema.dropTable('participantes')
};