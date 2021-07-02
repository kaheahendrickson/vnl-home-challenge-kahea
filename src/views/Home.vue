<template>
  <div>
    <template
      v-if="this.pageLoading || this.pageLoadFailure"
    >
      <div class="wrapper"></div>
      <div class="overlay"></div>
      <div class="spanner">
        <b-spinner
          v-if="this.pageLoading"
        >
        </b-spinner>
        <template
          v-if="this.pageLoadFailure"
        >
          <p>
            Apologies there was an error loading the page.
            Please refresh page.
            If problem persists contact support
          </p>
          </template>
        <template
          v-else
        >
          <p>loading large file please be patient</p>
        </template>
      </div>
    </template>
    <b-container
      fluid="sm"
    >
      <b-row
        id='vnl-header'
        class="mt-3 border text-center bg-white"
      >
        <b-col
          class="mt-3 pb-2"
        >
          <b-img 
            src="/vnl-logo-1.jpg"
          >
          </b-img>
        </b-col>
        <h2>VUE Home Challenge</h2>
        <h3>Kahea Hendrickson</h3>

      </b-row>

      <b-row
        v-if="this.pageLoadSuccess"
        class="mt-4 pt-3 border bg-white"
      > 
        <h1>Organizations</h1>

        <b-form-group
          label="Select By Attribute 1:"
          label-for="table-select-mode-select"
          label-cols-md="4"
        >
          <b-form-select
            id="org-table-attribute-1-select"
            v-model="attrSelected"
            :options="attribute1AllUnique"
            class="mb-3"
          ></b-form-select>
        </b-form-group>

        <b-table
          id="org-table"
          striped
          :items="orgsSelected"
          :fields="orgTable.fields"
          @row-clicked="orgRowClick"
          :per-page="orgTable.perPage"
          :current-page="orgTable.currentPage"
        >
          <template #cell(full_name)="data">
            {{ orgFullName(data.item) }}
          </template>
        </b-table>
        <b-pagination
          v-model="orgTable.currentPage"
          :total-rows="orgsSelected.length"
          :per-page="orgTable.perPage"
          align="fill"
          size="sm"
          class="my-0"
        ></b-pagination>

        <b-modal
          id="org-modal"
          ok-only
        >
          <template 
            #modal-title
            v-if="orgSelected"
          >
            <b-avatar
              variant="primary"
              :src="orgSelected.attribute3"
            >
            </b-avatar>
            <span id="org-full-name">{{ orgSelected.org }}</span>
          </template>
          <ul
            v-if="orgSelected"
          > 
            <li>
              <span class="fw-bold">Respondent:</span> 
              <span id="org-respondent">{{ orgFullName(orgSelected) }}</span>
            </li>
            <li>
              <span class="fw-bolder">Address:</span>
              <span id="org-address">{{ orgSelected.address }}</span>
            </li>
            <li>
              <span class="fw-bolder">Attribute 1:</span>
              <span id="org-attribute-1">{{ orgSelected.attribute1 }}</span>
            </li>
            <li>
              <span class="fw-bolder">Attribute 2:</span>
              <span id="org-attribute-2">{{ orgSelected.attribute2 }}</span>
            </li>
            <li>
              <span class="fw-bolder">Survey:</span>
              <span id="org-survey">{{ orgSelected.survey }}</span>
            </li>
            <li>
              <span class="fw-bolder">Question:</span>
              <span id="org-question">{{ orgSelected.question }}</span>
            </li>
          </ul>
        </b-modal>

      </b-row>

      <b-row
        v-if="this.pageLoadSuccess"
        class="mt-4 pt-3 border bg-white"
      >
        <h1>Questions</h1>
        
        <b-table
          id="questions-table"
          striped
          :items="questionsTableData"
          :fields="questionsTableFields"
        >
          <template #cell(average_answer)="data">
            {{ numberFormat(data.item.average_answer) }}
          </template>
        </b-table>
      </b-row>
    </b-container>
  </div>
</template>

<script>

import * as R from 'ramda'
import { 
  BCol,
  BContainer,
  BImg,
  BFormGroup,
  BFormSelect,
  BModal,
  BPagination,
  BRow,
  BSpinner,
  BTable
} from 'bootstrap-vue'

export default {
  name: 'Home',
  components: {
    BCol,
    BContainer,
    BImg,
    BFormGroup,
    BFormSelect,
    BModal,
    BPagination,
    BRow,
    BSpinner,
    BTable
  },
  data () {
    return {
      fetchUrl: process.env.VUE_APP_DATA_URL,
      fetchDataStatus: 'none',
      data: [],
      attrSelected: null,
      options: [],
      orgTable: {
        currentPage: null,
        perPage: 10,
        fields: [
          {
            key: 'org',
            label: 'Name'
          },
          {
            key: 'full_name',
            label: 'Respondent'
          }
        ]
      },
      orgSelected: null,
      questionsTableFields: [
        {
          key: 'question_id',
          label: 'ID'
        },
        {
          key: 'average_answer',
          label: 'Average Answer'
        }  
      ]
    }
  },
  methods: {
    fetchData: async function () {
      this.fetchDataStatus = 'fetching'
      return fetch(this.fetchUrl, {
        model: 'cors',
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
        .then(response => response.json())
        .then(result => {
          this.data = result.data
          this.fetchDataStatus = 'success'
          return
        })
        .catch(err => {
          console.log(err)
          this.fetchDataStatus = 'error'
          return
        })
    },
    orgRowClick: function (record, index) {
      this.orgSelected = record
      this.$bvModal.show('org-modal')
    },
    orgsByAttribute: function (attr, val) {
      return R.filter(
        R.propEq(attr, val),
        this.data
      )
    },
    orgsAttrributeByAttribute: function (attr, val, returnAttr) {
      return R.map(
        R.prop(returnAttr),
        this.orgsByAttribute(attr, val)
      )
    },
    orgNamesByAttribute: function (attr, val) {
      return this.orgsAttrributeByAttribute(attr, val, 'org')
    },
    orgByName: function (name) {
      return R.find(
        R.prop('org'),
        this.data
      )
    },
    answersByAttribute: function (attr, val) {
      return R.filter(
        R.propEq(attr, val),
        this.answers
      )
    },
    answersSumAttributeFindByAttribute: function (findAttr, findAttrVal, sumAttr) {
      return R.pipe(
        R.map(
          R.prop(sumAttr)
        ),
        R.sum
      )(this.answersByAttribute(findAttr, findAttrVal))
    },
    answersAverageAttributeByAttribute: function (findAttr, findAttrVal, sumAttr) {
      return R.divide(
        this.answersSumAttributeFindByAttribute(findAttr, findAttrVal, sumAttr),
        R.length(
          this.answersByAttribute(findAttr, findAttrVal)
        )
      )
    },
    answersSum: function (questionId) {
      return this.answersSumAttributeFindByAttribute(
        'question_id',
        questionId,
        'answer'
      )
    },
    answersAverage: function (questionId) {
      return this.answersAverageAttributeByAttribute(
        'question_id',
        questionId,
        'answer'
      )
    },
    orgFullName: function (org) {
      return `${org.first_name} ${org.last_name}`
    },
    numberFormat: function (number) {
      return Math.round(number * 10) / 10
    }
  },
  computed: {
    pageLoading: function () {
      return this.fetchDataStatus == 'fetching'
    },
    pageLoadFailure: function () {
      return this.fetchDataStatus == 'error'
    },
    pageLoadSuccess: function () {
      return this.fetchDataStatus == 'success'
    },
    answers: function () {
      return R.pipe(
        R.map(
          R.prop('answers')
        ),
        R.flatten
      )(this.data)
    },
    attribute1All: function () {
      return R.map(
        R.prop('attribute1'),
        this.data
      )
    },
    attribute1AllUnique: function () {
      return R.uniq(
        this.attribute1All
      ) 
    },
    orgsSelected: function () {
      return R.filter(
        R.propEq('attribute1', this.attrSelected),
        this.data
      )
    },
    questionIds: function () {
      return R.pipe(
        R.map(
          R.prop('question_id')
        ),
        R.uniq(),
        R.sort(R.comparator(R.lt))
      )(this.answers)
    },
    questionsTableData: function () {
      return R.map(
        (q) => {
          return {
            question_id: q,
            average_answer: this.answersAverage(q)
          }
        },
        this.questionIds
      )
    }
  },
  async mounted () {
    this.fetchData()
  }
}
</script>

<style scoped>
ul {
  list-style-type: none;
}

.overlay{
  position: fixed;
	width: 100%;
	height: 100%;
  background: rgba(0,0,0,0.7);
}

.spanner{
  position:absolute;
  top: 50%;
  left: 0;
  background: #2a2a2a55;
  width: 100%;
  display:block;
  text-align:center;
  height: 200px;
  color: #FFF;
  transform: translateY(-50%);
  z-index: 1000;
  padding-top: 70px;
}

.wrapper{
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  text-align:center;
  transform: translateX(-50%);
}

</style>