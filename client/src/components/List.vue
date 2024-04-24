<script>
export default {
  props: {
    elements: { type: Array, default: [] },
    activeIndex: { type: Number, default: -1 },
    buttonMaps: {},
    attributesNameMaps: {}
  },
  emits: ["update:activeIndex"],
  methods: {
    updateActiveIndex(index) {
      this.$emit("update:activeIndex", index);
    },
    getNumberOfRows() {
      if (this.elements.length > 4) {
        return Math.ceil(this.elements.length / 4);
      }
      return 1;
    },
    getNumberOfElementsPerRow(rowIndex) {
      const elementsPerRow = this.elements.length - (rowIndex - 1) * 4;
      if (elementsPerRow <= 4) {
        return elementsPerRow;
      }
      return 4;
    },
    getElementByIndex(rowIndex, colIndex) {
      const data = this.elements[((rowIndex - 1) * 4) + (colIndex - 1)];
      let result = Object.entries(data)
          .sort(([keyA], [keyB]) => keyA > keyB)
          .reduce((obj, [key,value]) => Object.assign(obj, {[key]: value}), {});
      return result;
    },
    getBSTarget(_id) {
      return `#${_id}`;
    },
    getTarget(_id) {
      return `${_id}`;
    }
  }
};
</script>

<template>
<div class="container">
  <div v-for="rowIndex in getNumberOfRows()" class="row">
    <div v-for="colIndex in getNumberOfElementsPerRow(rowIndex)" class="m-2 col-sm card">
      <div class="card-body" :key="getElementByIndex(rowIndex, colIndex)._id">
        <h5 style="height: 50px;" class="card-title text-center w-100 overflow-hidden">
          {{ getElementByIndex(rowIndex, colIndex).name }}
        </h5>
        <button class="btn btn-default btn-sm w-100" type="button" data-bs-toggle="collapse" :data-bs-target="getBSTarget(getElementByIndex(rowIndex, colIndex)._id)" aria-expanded="false" :aria-controls="getTarget(getElementByIndex(rowIndex, colIndex)._id)">
          <i class="bi bi-arrow-down-circle"></i>
        </button>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <div class="collapse" :id="getTarget(getElementByIndex(rowIndex, colIndex)._id)">
              <p class="card-text text-center" v-for="(value, attrName, index) in getElementByIndex(rowIndex, colIndex)">
                <div v-if="attrName != '_id' && !attrName.includes('Id')">
                  <strong>{{ attributesNameMaps[attrName] }}: </strong><br/>
                  <p>{{ value }}</p>
                </div>
              </p>
            </div>
          </li>
        </ul>
        <div class="d-flex justify-content-center">
          <div v-for="(metaData, _, __) in buttonMaps">
            <a v-if="metaData['condition']" @click="metaData['func'](getElementByIndex(rowIndex, colIndex)._id)" :class="metaData['buttonClasses']">  
              <i :class="metaData['icon']"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
