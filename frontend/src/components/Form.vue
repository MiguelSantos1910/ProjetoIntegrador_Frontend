<template>
  <form
    class="form"
    @submit.prevent="handleSubmit"
  >
    <!-- CABEÇALHO -->

    <div class="form-header">
      <h2 class="form-title">
        {{ title }}
      </h2>
    </div>


    <!-- FORMULÁRIO NORMAL -->

    <div
      v-if="!sections.length"
      class="form-fields"
    >
      <div
        v-for="field in fields"
        :key="field.name"
        class="form-field"
        :class="{
          full:
            field.full ||
            field.type === 'textarea' ||
            field.type === 'file'
        }"
      >
        <label :for="field.name">
          {{ field.label }}

          <span
            v-if="field.required"
            class="required"
          >
            *
          </span>
        </label>


        <!-- INPUT -->

        <input
          v-if="
            field.type !== 'select' &&
              field.type !== 'textarea' &&
              field.type !== 'file'
          "
          :id="field.name"
          v-model="formData[field.name]"
          :type="field.type || 'text'"
          :placeholder="field.placeholder"
          :required="field.required"
        >


        <!-- SELECT -->

        <select
          v-else-if="field.type === 'select'"
          :id="field.name"
          v-model="formData[field.name]"
          :required="field.required"
        >
          <option
            value=""
            disabled
          >
            {{ field.placeholder || 'Selecione uma opção' }}
          </option>

          <option
            v-for="option in field.options"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>


        <!-- TEXTAREA -->

        <textarea
          v-else-if="field.type === 'textarea'"
          :id="field.name"
          v-model="formData[field.name]"
          :placeholder="field.placeholder"
          :required="field.required"
        />


        <!-- FILE -->

        <div
          v-else-if="field.type === 'file'"
          class="file-upload"
        >
          <input
            :id="field.name"
            type="file"
            :accept="field.accept"
            :required="field.required"
            :multiple="field.multiple"
            @change="handleFileChange($event, field.name)"
          >

          <label
            :for="field.name"
            class="file-label"
          >
            <component
              :is="field.icon"
              v-if="field.icon"
              :size="28"
              :stroke-width="1.8"
              class="file-icon"
            />

            <span class="file-upload-text">
              {{ field.placeholder || 'Clique para fazer upload ou arraste' }}
            </span>

            <span class="file-upload-info">
              {{ field.info || 'PNG, JPG de até 5MB' }}
            </span>
          </label>

          <span
            v-if="fileNames[field.name]"
            class="file-name"
          >
            {{ fileNames[field.name] }}
          </span>
        </div>
      </div>
    </div>


    <!-- FORMULÁRIO COM SEÇÕES -->

    <div
      v-else
      class="form-sections"
    >

      <!-- COLUNA PRINCIPAL -->

      <div class="form-main-sections">
        <section
          v-for="section in mainSections"
          :key="section.title"
          class="form-section"
          :class="section.class"
        >
          <div class="form-section-header">
            <h3 class="form-section-title">
              <component
                :is="section.icon"
                v-if="section.icon"
                :size="15"
                :stroke-width="1.8"
                class="form-section-icon"
              />

              <span>
                {{ section.title }}
              </span>
            </h3>

            <span
              v-if="section.badge"
              class="form-section-badge"
            >
              {{ section.badge }}
            </span>
          </div>


          <!-- CAMPOS DA SEÇÃO -->

          <div
            v-if="section.fields?.length"
            class="form-section-fields"
            :class="{
              'three-columns': section.columns === 3
            }"
          >
            <div
              v-for="field in section.fields"
              :key="field.name"
              class="form-field"
              :class="{
                full:
                  field.full ||
                  field.type === 'textarea' ||
                  field.type === 'file'
              }"
            >
              <label :for="field.name">
                {{ field.label }}

                <span
                  v-if="field.required"
                  class="required"
                >
                  *
                </span>
              </label>


              <!-- INPUT -->

              <input
                v-if="
                  field.type !== 'select' &&
                    field.type !== 'textarea' &&
                    field.type !== 'file'
                "
                :id="field.name"
                v-model="formData[field.name]"
                :type="field.type || 'text'"
                :placeholder="field.placeholder"
                :required="field.required"
              >


              <!-- SELECT -->

              <select
                v-else-if="field.type === 'select'"
                :id="field.name"
                v-model="formData[field.name]"
                :required="field.required"
              >
                <option
                  value=""
                  disabled
                >
                  {{ field.placeholder || 'Selecione uma opção' }}
                </option>

                <option
                  v-for="option in field.options"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>


              <!-- TEXTAREA -->

              <textarea
                v-else-if="field.type === 'textarea'"
                :id="field.name"
                v-model="formData[field.name]"
                :placeholder="field.placeholder"
                :required="field.required"
              />


              <!-- FILE -->

              <div
                v-else-if="field.type === 'file'"
                class="file-upload"
              >
                <input
                  :id="field.name"
                  type="file"
                  :accept="field.accept"
                  :required="field.required"
                  :multiple="field.multiple"
                  @change="handleFileChange($event, field.name)"
                >

                <label
                  :for="field.name"
                  class="file-label"
                >
                  <component
                    :is="field.icon"
                    v-if="field.icon"
                    :size="28"
                    :stroke-width="1.8"
                    class="file-icon"
                  />

                  <span class="file-upload-text">
                    {{ field.placeholder || 'Clique para fazer upload ou arraste' }}
                  </span>

                  <span class="file-upload-info">
                    {{ field.info || 'PNG, JPG de até 5MB' }}
                  </span>
                </label>

                <span
                  v-if="fileNames[field.name]"
                  class="file-name"
                >
                  {{ fileNames[field.name] }}
                </span>
              </div>
            </div>
          </div>


          <!-- CONTEÚDO CUSTOMIZADO -->

          <div
            v-if="section.content"
            class="form-section-content"
          >
            <slot
              :name="section.content"
            />
          </div>
        </section>
      </div>


      <!-- COLUNA LATERAL -->

      <aside class="form-sidebar-sections">
        <section
          v-for="section in sidebarSections"
          :key="section.title"
          class="form-section"
          :class="section.class"
        >
          <div class="form-section-header">
            <h3 class="form-section-title">
              <component
                :is="section.icon"
                v-if="section.icon"
                :size="15"
                :stroke-width="1.8"
                class="form-section-icon"
              />

              <span>
                {{ section.title }}
              </span>
            </h3>

            <span
              v-if="section.badge"
              class="form-section-badge"
            >
              {{ section.badge }}
            </span>
          </div>


          <!-- CAMPOS DA SEÇÃO -->

          <div
            v-if="section.fields?.length"
            class="form-section-fields"
            :class="{
              'three-columns': section.columns === 3
            }"
          >
            <div
              v-for="field in section.fields"
              :key="field.name"
              class="form-field"
              :class="{
                full:
                  field.full ||
                  field.type === 'textarea' ||
                  field.type === 'file'
              }"
            >
              <label :for="field.name">
                {{ field.label }}

                <span
                  v-if="field.required"
                  class="required"
                >
                  *
                </span>
              </label>


              <!-- INPUT -->

              <input
                v-if="
                  field.type !== 'select' &&
                    field.type !== 'textarea' &&
                    field.type !== 'file'
                "
                :id="field.name"
                v-model="formData[field.name]"
                :type="field.type || 'text'"
                :placeholder="field.placeholder"
                :required="field.required"
              >


              <!-- SELECT -->

              <select
                v-else-if="field.type === 'select'"
                :id="field.name"
                v-model="formData[field.name]"
                :required="field.required"
              >
                <option
                  value=""
                  disabled
                >
                  {{ field.placeholder || 'Selecione uma opção' }}
                </option>

                <option
                  v-for="option in field.options"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>


              <!-- TEXTAREA -->

              <textarea
                v-else-if="field.type === 'textarea'"
                :id="field.name"
                v-model="formData[field.name]"
                :placeholder="field.placeholder"
                :required="field.required"
              />


              <!-- FILE -->

              <div
                v-else-if="field.type === 'file'"
                class="file-upload"
              >
                <input
                  :id="field.name"
                  type="file"
                  :accept="field.accept"
                  :required="field.required"
                  :multiple="field.multiple"
                  @change="handleFileChange($event, field.name)"
                >

                <label
                  :for="field.name"
                  class="file-label"
                >
                  <component
                    :is="field.icon"
                    v-if="field.icon"
                    :size="28"
                    :stroke-width="1.8"
                    class="file-icon"
                  />

                  <span class="file-upload-text">
                    {{ field.placeholder || 'Clique para fazer upload ou arraste' }}
                  </span>

                  <span class="file-upload-info">
                    {{ field.info || 'PNG, JPG de até 5MB' }}
                  </span>
                </label>

                <span
                  v-if="fileNames[field.name]"
                  class="file-name"
                >
                  {{ fileNames[field.name] }}
                </span>
              </div>
            </div>
          </div>


          <!-- CONTEÚDO CUSTOMIZADO -->

          <div
            v-if="section.content"
            class="form-section-content"
          >
            <slot
              :name="section.content"
            />
          </div>
        </section>
      </aside>
    </div>


    <!-- AÇÕES -->

    <div class="form-actions">
      <button
        type="button"
        class="btn-cancel"
        @click="emit('cancel')"
      >
        Cancelar
      </button>

      <button
        type="submit"
        class="btn-submit"
      >
        {{ submitButtonText }}
      </button>
    </div>
  </form>
</template>


<script setup>
import { computed, reactive } from 'vue'

import '../assets/css/Form.css'


/* ========================================
   PROPS
   ======================================== */

const props = defineProps({
  title: {
    type: String,
    default: 'Formulário'
  },

  fields: {
    type: Array,
    default: () => []
  },

  sections: {
    type: Array,
    default: () => []
  },

  submitButtonText: {
    type: String,
    default: 'Salvar'
  },

  initialData: {
    type: Object,
    default: () => ({})
  }
})


/* ========================================
   EVENTOS
   ======================================== */

const emit = defineEmits([
  'submit',
  'cancel'
])


/* ========================================
   DADOS DO FORMULÁRIO
   ======================================== */

const formData = reactive({
  ...props.initialData
})


const fileNames = reactive({})


/* ========================================
   SEPARAÇÃO DAS SEÇÕES
   ======================================== */

/*
 * Seções normais:
 * ficam na coluna principal.
 */

const mainSections = computed(() => {
  return props.sections.filter((section) => {
    return !section.class?.includes('sidebar-section')
  })
})


/*
 * Seções com "sidebar-section":
 * ficam na coluna lateral.
 */

const sidebarSections = computed(() => {
  return props.sections.filter((section) => {
    return section.class?.includes('sidebar-section')
  })
})


/* ========================================
   UPLOAD DE ARQUIVOS
   ======================================== */

const handleFileChange = (event, fieldName) => {
  const files = Array.from(
    event.target.files || []
  )

  if (!files.length) {
    return
  }

  formData[fieldName] = files.length === 1
    ? files[0]
    : files

  fileNames[fieldName] = files.length === 1
    ? files[0].name
    : `${files.length} arquivos selecionados`
}


/* ========================================
   ENVIO
   ======================================== */

const handleSubmit = () => {
  emit(
    'submit',
    {
      ...formData
    }
  )
}
</script>