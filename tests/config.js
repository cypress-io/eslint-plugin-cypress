/* global describe, it, expect */
'use strict'

const globals = require('globals')
const config = require('../lib/flat.js')

describe('globals languageOptions', () => {
  const languageOptions = config.configs.globals.languageOptions

  it('should not mutate globals', () => {
    expect(globals.browser).not.toHaveProperty('cy')
    expect(globals.mocha).not.toHaveProperty('cy')
  })

  it('should include other globals', () => {
    expect(languageOptions.globals).toEqual(expect.objectContaining(globals.browser))
    expect(languageOptions.globals).toEqual(expect.objectContaining(globals.mocha))
  })

  it('should include cypress globals', () => {
    expect(languageOptions.globals).toEqual(expect.objectContaining({
      cy: false,
      Cypress: false,
    }))
  })
})
