<template>
  <div style="margin: 1rem">
    <v-data-table :headers="headers" :items="userData" item-value="name" style="margin-top: 1rem;">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Reports</v-toolbar-title>
        </v-toolbar>
      </template>

      <template v-slot:item.report="{ item }">
        <td class="report-cell">{{ item.report }}</td>
      </template>

      <template v-slot:expanded-row="{ columns, item }">
        <tr>
          <td :colspan="columns.length">More info about {{ item.name }}</td>
        </tr>
      </template>
    </v-data-table>

    <!-- Buttons -->
    <v-btn @click="getUsersData" style="margin: 1rem;">Refresh</v-btn>
    <v-btn @click="downloadUserData" style="margin: 1rem;">Download All</v-btn>
    <v-btn @click="downloadPreviousMonthData" style="margin: 1rem;">Download Previous Month</v-btn>
    <v-btn @click="downloadCurrentMonthData" style="margin: 1rem;">Download Current Month</v-btn>
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted } from "vue";
import { getData, postData } from "@/services/api.js";

const props = defineProps({
  email: String,
});

const userData = ref([]);

const headers = [
  { title: "Date", align: "start", sortable: true, key: "date" },
  { title: "Time (hours)", sortable: true, key: "time" },
  { title: "Report", sortable: false, key: "report" },
];

/**
 * Fetch user data from the server
 */
const getUsersData = async () => {
  try {
    const data = { email: props.email };
    const response = await getData("/csv-users");
    if (response.userData) {
      userData.value = response.userData;
    } else {
      console.error("Error fetching user data", response.error);
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

/**
 * Download all user data as a CSV
 */
const downloadUserData = async () => {
  try {
    const post_data = { email: props.email };
    const response = await postData("/csv-user", post_data);

    let csv = "Date|Time|Report\n";
    const data = response.userData;

    if (Array.isArray(data)) {
      data.forEach((row) => {
        if (typeof row === "object" && row !== null) {
          const rowValues = [row.date, row.time, row.report];
          csv += rowValues.join("|") + "\n";
        }
      });
    } else {
      console.error("Expected response to be an array, but got:", data);
    }

    const anchor = document.createElement("a");
    anchor.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    anchor.target = "_blank";
    anchor.download = `reports.data.${props.email}.csv`;
    anchor.click();
  } catch (error) {
    console.error("Error downloading user data:", error);
  }
};

/**
 * Get the date range for a specific month
 */
const getMonthDateRange = (year, month) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  return { startDate, endDate };
};

/**
 * Filter data by date range
 */
const filterDataByDateRange = (data, startDate, endDate) => {
  return data.filter((row) => {
    const rowDate = new Date(row.date);
    return rowDate >= startDate && rowDate <= endDate;
  });
};

/**
 * Download current month's data
 */
const downloadCurrentMonthData = async () => {
  const date = new Date();
  const { startDate, endDate } = getMonthDateRange(date.getFullYear(), date.getMonth() + 1);
  const filteredData = filterDataByDateRange(userData.value, startDate, endDate);
  await downloadFilteredData(filteredData, "current_month");
};

/**
 * Download previous month's data
 */
const downloadPreviousMonthData = async () => {
  const date = new Date();
  const { startDate, endDate } = getMonthDateRange(date.getFullYear(), date.getMonth());
  const filteredData = filterDataByDateRange(userData.value, startDate, endDate);
  await downloadFilteredData(filteredData, "previous_month");
};

/**
 * Download filtered data as a CSV
 */
const downloadFilteredData = async (filteredData, periodLabel) => {
  try {
    let csv = "Date|Time|Report\n";
    filteredData.forEach((row) => {
      const rowValues = [row.date, row.time, row.report];
      csv += rowValues.join("|") + "\n";
    });

    const anchor = document.createElement("a");
    anchor.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    anchor.target = "_blank";
    anchor.download = `reports.${props.email}.${periodLabel}.csv`;
    anchor.click();
  } catch (error) {
    console.error(`Error downloading ${periodLabel} data:`, error);
  }
};

// Fetch data on component mount
onMounted(() => {
  getUsersData();
});
</script>

<style scoped>
.report-cell {
  width: 50rem;
  max-width: 50rem;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-height: 100px;
  overflow-y: auto;
  padding: 4px;
  display: block;
}
</style>
