import { shallowMount } from '@vue/test-utils'
import Home from '../../src/views/Home.vue' 
import { enableFetchMocks, fetchMock } from 'jest-fetch-mock'
import flushPromises from 'flush-promises'

enableFetchMocks()

import minimalData from '../fixtures/minimal.json'

let wrapper
let vm

beforeAll(async () => {
  fetch.mockResponseOnce(
    JSON.stringify(minimalData)
  )
  wrapper = shallowMount(Home)
  vm = wrapper.vm
  // wait for our api call run from lifecycle 'mounted' to finish
  await flushPromises()
})

test('attribute1All', () => {
  expect(vm.attribute1All)
    .toMatchObject([
      'red',
      'indigo',
      'violet',
      'violet'
    ])
})

test('attribute1AllUnique', () => {
  expect(vm.attribute1AllUnique)
    .toMatchObject([
      'red',
      'indigo',
      'violet'
    ])
})

test('computed answers', () => {
  expect(vm.answers.length)
    .toEqual(10)
})

test('orgsByAttribute', () => {
  expect(vm.orgsByAttribute('attribute1', 'red'))
    .toMatchObject([
      {
        id: 1
      }
    ])

  expect(vm.orgsByAttribute('attribute1', 'none'))
    .toMatchObject([])
})

test('orgNamesByAttribute', () => {
  expect(vm.orgNamesByAttribute('attribute1', 'red'))
    .toMatchObject([
      "Fay - Parisian" 
    ])
})

test('orgByName', () => {
  expect(vm.orgByName('Fay - Parisian'))
    .toMatchObject({
      org: "Fay - Parisian"
    })
})

test('questionIds', () => {
  expect(vm.questionIds)
    .toEqual([
      1,
      2,
      3,
      4
    ])
})

test('answersByAttribute', () => {
  expect(vm.answersByAttribute('question_id', 1))
    .toMatchObject([
      {
        answer: 2,
        question_id: 1
      },
      {
        answer: 1,
        question_id: 1
      },
      {
        answer: 4,
        question_id: 1
      },
      {
        answer: 1,
        question_id: 1
      },
    ])
})

test('answersSum', () => {
  expect(vm.answersSum(1))
    .toEqual(8)
})

test('answersAverage', () => {
  expect(vm.answersAverage(1))
    .toEqual(2)
})

test('select attr', () => {
  expect(vm.attrSelected)
    .toEqual(null)

  expect(vm.orgsSelected)
    .toMatchObject([])

  vm.attrSelected = 'violet'

  expect(vm.orgsSelected)
    .toMatchObject([
      {
        id: 3
      },
      {
        id: 4
      }
    ])
})

test('questions table data', () => {
  expect(vm.questionsTableData)
    .toMatchObject([
      {
        average_answer: 2,
        question_id: 1
      },
      {
        average_answer: 3,
        question_id: 2
      },
      {
        average_answer: 2,
        question_id: 3
      },
      {
        average_answer: 2.5,
        question_id: 4
      },
    ])
})
