<template>
  <div class="dashboard-editor-container">

    <el-row
      style="background: #fff; padding: 16px 16px 0; margin-bottom: 32px"
    >
      <div style="text-align:center;">基金投资收益统计表</div>
      <el-select v-model="currentAccountName" placeholder="请选择" @change="changeAccount">
        <el-option
          v-for="item in myAccountData"
          :key="item.id"
          size="mini"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-button @click="handleCreate('accountForm')">添加基金账号</el-button>
      <!-- 添加或修改账号对话框 -->
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="accountFormVisible">
        <el-form ref="accountForm" :model="accountForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
          <el-form-item label="账号名" prop="name">
            <el-input v-model="accountForm.name" />
          </el-form-item>
          <el-form-item label="会员来源" prop="sourceType">
            <el-select
              v-model="accountForm.sourceType"
              placeholder="选择来源"
              style="width: 400px"
            >
              <el-option
                v-for="item in accountSourceType"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="accountFormVisible = false">取消</el-button>
          <el-button v-if="dialogStatus=='create'" type="primary" @click="createData('accountForm')">确定</el-button>
          <el-button v-else type="primary" @click="updateData">确定</el-button>
        </div>
      </el-dialog>
      <el-button style="float:right" @click="handleCreate('incomeForm')">添加收益记录</el-button>
      <!-- 添加或修改日收益记录对话框 -->
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="incomeFormVisible">
        <el-form ref="incomeForm" :model="incomeForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
          <el-form-item label="账号名">
            <el-input v-model="currentAccount.name" disabled />
          </el-form-item>
          <el-form-item label="关联基金">
            <el-select v-model="incomeForm.fundId" placeholder="请选择基金">
              <el-option
                v-for="item in myFundData"
                :key="item.fundId"
                :label="item.name"
                :value="item.fundId"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="持仓">
            <el-input v-model="incomeForm.totalAmount" type="number" @input="oninput" />
          </el-form-item>
          <el-form-item label="持有收益">
            <el-input v-model="incomeForm.incomeAmount" type="number" @input="incomeForm.incomeAmount=/^\-?\d+\.?\d{0,2}$/.test(incomeForm.incomeAmount)||incomeForm.incomeAmount == '' ? incomeForm.incomeAmount : incomeForm.incomeAmount=''" />
          </el-form-item>
          <el-form-item label="持有收益率">
            <span>{{ keepTwoDecimalFull(incomeForm.incomeAmount * 100 / (incomeForm.totalAmount - incomeForm.incomeAmount)) }}%</span>
          </el-form-item>
          <el-form-item label="记录时间">
            <el-date-picker v-model="incomeForm.recordTime" type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="选择日期" style="width: 100%;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="incomeFormVisible = false">取消</el-button>
          <el-button v-if="dialogStatus=='create'" type="primary" @click="createData('incomeForm')">确定</el-button>
          <el-button v-else type="primary" @click="updateData">确定</el-button>
        </div>
      </el-dialog>
      <el-button style="float:right" @click="handleCreate('accountHoldForm')">添加账号持有基金</el-button>
      <!-- 添加或修改账号持有基金对话框 -->
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="accountHoldFormVisible">
        <el-form ref="accountHoldForm" :model="accountHoldForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
          <el-form-item label="账号名">
            <el-input v-model="currentAccount.name" disabled />
          </el-form-item>
          <el-form-item label="关联基金">
            <el-autocomplete
              v-model="accountHoldForm.fundName"
              value-key="name"
              :fetch-suggestions="readFundDataList"
              placeholder="请输入基金代码或基金名"
              @select="handleSelect"
            />
          </el-form-item>
          <el-form-item label="购入时间">
            <el-date-picker v-model="accountHoldForm.buyTime" type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="选择日期" style="width: 100%;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="accountHoldFormVisible = false">取消</el-button>
          <el-button v-if="dialogStatus=='create'" type="primary" @click="createData('accountHoldForm')">确定</el-button>
          <el-button v-else type="primary" @click="updateData">确定</el-button>
        </div>
      </el-dialog>

      <!-- 表格list -->
      <el-table :data="myMonthData" border @sort-change="changeTableSort">
        <el-table-column
          type="index"
          label="序号"
          width="150"
        />
        <el-table-column
          prop="fundName"
          label="基金名"
          width="150"
        />
        <el-table-column
          prop="holdAmount"
          label="目前持仓"
          width="150"
        />
        <el-table-column
          prop="holdPercentage"
          label="持仓占比"
          width="150"
        >
          <template slot-scope="{ row }">
            <span class="link-type">{{ row.holdPercentage }} %</span>
          </template>
        </el-table-column>

        <el-table-column label="截止持有收益" align="center ">
          <!-- 动态生成列 -->
          <el-table-column
            v-for="(item,index) in myDateData"
            :key="index"
            :label="item.label"
            :prop="item.prop"
          /></el-table-column>

      </el-table>
    </el-row>
    <el-row v-if="showChart" style="background:#fff">
      <line-chart :chart-data="lineChartData" />
    </el-row>
  </div>
</template>

<script>
import { accountCreateOrUpdate, readFundList, accountHoldCreateOrUpdate, incomeRecordCreateOrUpdate,
  readMyAccount, readMyFund } from '@/api/fund/fund-api'
import { monthData } from '@/api/fund/fund-dashboard-api'
import LineChart from './components/LineChart'
require('echarts/theme/macarons') // echarts theme

export default {
  name: 'DashboardAdmin',
  components: {
    LineChart
  },
  data() {
    return {
      incomeFormVisible: false,
      accountFormVisible: false,
      accountHoldFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      accountForm: {},
      accountHoldForm: {},
      incomeForm: {},
      memberForm: {},
      lineChartData: {},
      show: true,
      dateList: [{ label: '2021-08', prop: '2021-08' },
        { label: '2021-07', prop: '2021-07' },
        { label: '2021-06', prop: '2021-06' },
        { label: '2021-05', prop: '2021-05' },
        { label: '2021-04', prop: '2021-04' }],
      accountData: [{ name: '牛逼', account: 'XXX' }, { name: '牛逼1', account: 'XXX1' }],
      value: '',
      chart: null,
      accountSourceType: [],
      fundList: [],
      dataList: [],
      restaurants: undefined,
      myFundData: [],
      myAccountData: [],
      myMonthData: [],
      myDateData: [],
      currentAccount: {},
      needLogin: false,
      showChart: false,
      currentAccountName: null
    }
  },
  created() {
    this.getConfigTypeOptions()

    this.initData()
  },
  methods: {
    initData() {
      // 读取我的账号
      readMyAccount().then(res => {
        this.myAccountData = res.data
        if (this.myAccountData.length === 0) {
          this.$notify({
            title: '暂无账号',
            message: '请创建基金账号'
          })
        } else {
          this.currentAccount = this.myAccountData[0]
          this.currentAccountName = this.currentAccount.name
          this.getMyFundData()
          this.getMonthData()
        }
      })
    },
    getMonthData() {
      monthData({ accountId: this.currentAccount.id }).then(res => {
        this.myMonthData = res.data.data
        this.myDateData = res.data.dateList
        this.lineChartData = {
          seriesData: res.data.seriesData,
          xStr: res.data.xStr,
          nameStr: res.data.nameStr
        }
        this.showChart = true
        // this.chart = echarts.init(this.$refs.chart1, 'macarons')
        // this.setOptions(res.data.seriesData, res.data.nameStr, res.data.xStr)
      })
    },
    keepTwoDecimalFull(num) {
      var result = parseFloat(num)
      if (isNaN(result)) {
        return 0.00
      }
      result = Math.round(num * 100) / 100
      var s_x = result.toString() // 将数字转换为字符串

      var pos_decimal = s_x.indexOf('.') // 小数点的索引值

      // 当整数时，pos_decimal=-1 自动补0
      if (pos_decimal < 0) {
        pos_decimal = s_x.length
        s_x += '.'
      }

      // 当数字的长度< 小数点索引+2时，补0
      while (s_x.length <= pos_decimal + 2) {
        s_x += '0'
      }
      return s_x
    },
    /**
 * 更改账号
 */
    changeAccount(index) {
      console.log('**', index)
      this.currentAccount = this.myAccountData[index - 1]
      console.log('***', this.currentAccount)
      this.currentAccountName = this.currentAccount.name
      this.getMyFundData()
      this.getMonthData()
    },

    // 拿会员来源配置类型
    getConfigTypeOptions() {
        this.accountSourceType = [{label: '支付宝', value: 'zhifubao'}]
    },
    /**
     * 读取我持有基金数据
     */
    getMyFundData() {
      readMyFund({ accountId: this.currentAccount.id }).then(res => {
        this.myFundData = res.data
      })
    },
    resetTemp() {
      this.accountForm = {}
    },
    /**
     * 打开创建窗口
     */
    handleCreate(form) {
      if (form === 'incomeForm') {
        this.incomeFormVisible = true
      } else if (form === 'accountHoldForm') {
        this.accountHoldFormVisible = true
      } else {
        this.accountFormVisible = true
      }
      this.resetTemp()
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.$refs[form].clearValidate()
      })
    },
    oninput(e) {
      // 通过正则过滤小数点后两位
      e.target.value = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null

      console.log('e', e.target.value)
      // value = value.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g, '')
      // value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
      // if (value.indexOf('.') !== value.lastIndexOf('.')) {
      //   const index = value.lastIndexOf('.')
      //   value = value.substr(0, index)
      // }
      // value = 5
    },
    /**
     * 创建数据
     */
    createData(form) {
      console.log('form', form)
      if (form === 'accountForm') {
        accountCreateOrUpdate(this.accountForm).then(() => {
          this.accountFormVisible = false
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success'
          })
        })
      } else if (form === 'accountHoldForm') {
        this.accountHoldForm.accountId = this.currentAccount.id
        accountHoldCreateOrUpdate(this.accountHoldForm).then(() => {
          this.accountHoldFormVisible = false
          this.getMyFundData()
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success'
          })
        })
      } else {
        this.incomeForm.accountId = this.currentAccount.id
        incomeRecordCreateOrUpdate(this.incomeForm).then(() => {
          this.incomeFormVisible = false
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success'
          })
        })
      }
    },
    readFundDataList(queryString, cb) {
      readFundList({ key: queryString }).then(res => {
        if (res.code === 0) {
          cb(res.data)
        } else {
          var list = [{ value: '查询数据出错' }]
          cb(list)
        }
      })
    },
    changeTableSort() {},
    handleSelect(item) {
      this.accountHoldForm.fundId = item.id
      console.log('***', item)
    },
    updateData() {},

    /**
     * seriesData 数据
     * xStr x轴名称
     * nameStr 示例图标注
     */
    setOptions({ seriesData, xStr, nameStr } = {}) {
      this.chart.setOption({
        xAxis: {
          data: xStr,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: nameStr
        },
        series: seriesData
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
