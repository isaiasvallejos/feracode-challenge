#!/usr/bin/env node

import 'dotenv/config'
import { argv } from 'yargs'
import inquirer from 'inquirer'

import createDatabaseDesigns from 'database/design'
import {
  destroyDatabase,
  createDatabase,
  createConnectionAsDefault,
  getDatabaseOrNil
} from 'vendor/couchdb/connection'

const prompt = inquirer.createPromptModule()
const connection = createConnectionAsDefault()

const down = () =>
  destroyDatabase(process.env.COUCHDB_DATABASE, connection).then(() =>
    console.info('Migration down succeed!')
  )

const up = () =>
  getDatabaseOrNil(process.env.COUCHDB_DATABASE, connection).then(database => {
    if (database) {
      console.info(`Database ${process.env.COUCHDB_DATABASE} already exists...`)

      return prompt([
        {
          name: 'shouldDown',
          type: 'confirm',
          message:
            'Perform migration down before up? (this will delete the database)',
          default: false
        }
      ]).then(({ shouldDown }) => {
        if (shouldDown) return down().then(up)
      })
    } else {
      return createDatabase(process.env.COUCHDB_DATABASE, connection)
        .then(() =>
          createDatabaseDesigns().then(() =>
            console.info('Document designs created!')
          )
        )
        .then(() => console.info('Migration up succeed!'))
    }
  })

if (argv.up) {
  up()
}

if (argv.down) {
  down()
}
