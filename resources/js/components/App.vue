<template>
    <div id="app">
        <v-app id="inspire">
            <v-app-bar app color="primary" dark fixed elevation="3">
                <v-toolbar-title><strong><h4>Онлайн-цитатник</h4></strong></v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn text @click="addQuote()"><v-icon dark class="mr-1">mdi-plus-circle</v-icon>Публикация цитаты</v-btn>
                </v-toolbar-items>
            </v-app-bar>
            <v-main>
                <v-container fluid fill-height>
                    <v-flex xs12 sm6 offset-sm3>
                        <div class="text-center">
                            <v-skeleton-loader
                                v-bind="attrs"
                                type="article"
                                v-if="loading"
                            ></v-skeleton-loader>
                        </div>
                        <div class="text" v-for="quote in quotes">
                            <v-card
                                class="mx-auto mb-3"
                                :elevation="3"
                                @click="openQuote(quote.id)"
                            >
                                <v-card-text class="text-h6 font-weight-bold">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td class="tbltdtop">
                                                    <v-icon left large>mdi-format-quote-open</v-icon>
                                                </td>
                                                <td>
                                                    {{ quote.text }}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </v-card-text>

                                <div class="pl-6 pb-6 pr-6">
                                    <span v-for="tag in quote.tags">
                                    <v-chip
                                        class="mr-3 mt-3"
                                        color="primary"
                                        label
                                    ><v-icon left>mdi-label</v-icon>
                                        {{ tag.name }}
                                    </v-chip>
                                    </span>
                                </div>

                                <v-divider></v-divider>

                                <v-card-actions>
                                    <v-list-item class="grow">
                                        <v-row
                                            align="center"
                                        >
                                            <v-col class="col-auto" auto>
                                                <span>
                                                    <strong>{{ quote.author }}</strong>
                                                </span>
                                            </v-col>
                                            <v-col align="right">
                                                <span>
                                                    <strong>{{ quote.date }}</strong>
                                                </span>
                                            </v-col>
                                        </v-row>
                                    </v-list-item>
                                </v-card-actions>
                            </v-card>
                        </div>

                        <div class="text-center mt-3">
                            <v-pagination
                                v-model="page"
                                :length="totalPages"
                                color="primary"
                                @input="handlePageChange"
                            ></v-pagination>
                        </div>

                        <v-row justify="center">
                            <v-dialog
                              v-model="dialog"
                              persistent
                              max-width="600px"
                            >
                                <v-card>
                                    <v-card-title>
                                        <span class="text-h5">Опубликовать цитату</span>
                                    </v-card-title>
                                    <v-card-text>
                                        <v-container>
                                            <v-alert
                                                v-model="error_alert"
                                                dense
                                                type="error"
                                            >
                                                {{ error_message }}
                                            </v-alert>
                                            <v-row>
                                                <v-col cols="12">
                                                    <v-text-field
                                                        label="Текст цитаты"
                                                        v-model="quote_text"
                                                        :rules="[v => !!v || 'Необходимо заполнить поле!']"
                                                        required
                                                    ></v-text-field>
                                                </v-col>
                                                <v-col cols="12">
                                                    <v-text-field
                                                        label="Автор"
                                                        v-model="quote_author"
                                                        required
                                                        :rules="[v => !!v || 'Необходимо заполнить поле!']"
                                                    ></v-text-field>
                                                </v-col>
                                                <v-col cols="12">
                                                    <v-combobox
                                                        v-model="model"
                                                        :filter="filter"
                                                        :hide-no-data="!search"
                                                        :items="items"
                                                        :search-input.sync="search"
                                                        :rules="[v => !!v || 'Необходимо указать хотя бы 1 тег!']"
                                                        :error-messages="errors"
                                                        :counter="3"
                                                        v-on:change="changer"
                                                        hide-selected
                                                        label="Список тегов"
                                                        multiple
                                                        small-chips
                                                        solo
                                                        required
                                                        @keypress.enter.prevent
                                                    >
                                                        <template v-slot:no-data>
                                                            <v-list-item>
                                                                <span class="subheading">Тег не найден </span>
                                                            </v-list-item>
                                                        </template>
                                                        <template v-slot:selection="{ attrs, item, parent, selected }">
                                                            <v-chip
                                                                v-if="item === Object(item)"
                                                                v-bind="attrs"
                                                                color="primary"
                                                                :input-value="selected"
                                                                label
                                                                small
                                                                dark
                                                                @keypress.enter.prevent
                                                            >
                                                                <span class="pr-2">
                                                                    {{ item.text }}
                                                                </span>
                                                                <v-icon
                                                                    small
                                                                    @click="parent.selectItem(item)"
                                                                >
                                                                    mdi-close
                                                                </v-icon>
                                                            </v-chip>
                                                        </template>
                                                        <template v-slot:item="{ index, item }">
                                                            <v-chip
                                                                
                                                                color="primary"
                                                                dark
                                                                label
                                                                small
                                                            >
                                                                {{ item.text }}
                                                            </v-chip>
                                                        </template>
                                                    </v-combobox>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn
                                            color="primary"
                                            text
                                            @click="dialog = false"
                                        >
                                            Закрыть
                                        </v-btn>
                                        <v-btn
                                            color="primary"
                                            text
                                            @click="publishQuote()"
                                        >
                                            Сохранить
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-row>

                        <v-row justify="center">
                            <v-col cols="12">
                                <v-dialog
                                    transition="dialog-top-transition"
                                    max-width="600"
                                    v-model="dialog_quote"
                                >
                                    <template v-slot:default="dialog_quote">
                                        <v-card>
                                            <v-toolbar
                                                color="primary"
                                                dark
                                            ><strong class="ml-2">{{ quote_author_sel }}</strong></v-toolbar>
                                            <v-card-text class="text-h4 pa-6">
                                                <table>
                                                    <tbody>
                                                        <tr>
                                                            <td class="tbltdtop">
                                                                <v-icon left x-large>mdi-format-quote-open</v-icon>
                                                            </td>
                                                            <td>
                                                                {{ quote_text_sel }}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <div align="right">
                                                    <span class="text-h6 mr-2">{{ quote_date_sel }}</span>
                                                </div>
                                                <div class="pl-6 pr-6">
                                                    <span v-for="tag in quote_tags_sel">
                                                    <v-chip
                                                        class="mr-3 mt-3"
                                                        color="primary"
                                                        label
                                                    ><v-icon left>mdi-label</v-icon>
                                                        {{ tag.name }}
                                                    </v-chip>
                                                    </span>
                                                </div>

                                                <v-text-field
                                                    :value="quote_format"
                                                    label="Для копирования"
                                                    outlined
                                                    readonly
                                                    dense
                                                    class="ml-3 mr-3 mt-6"
                                                ></v-text-field>
                                            </v-card-text>
                                            <v-card-actions class="justify-end">
                                                <v-btn
                                                    text
                                                    @click="dialog_quote.value = false"
                                                >Закрыть</v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </template>
                                </v-dialog>
                            </v-col>
                        </v-row>

                    </v-flex>
                </v-container>
            </v-main>

            <v-footer padless color="primary" dark>
                <v-col
                    class="text-center"
                    cols="12"
                >
                    &copy; 2021 — Test task
                </v-col>
            </v-footer>
        </v-app>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                page: 1,
                totalPages: 1,
                quotes: [],
                currentPage: 1,
                loading: true,
                error_alert: false,
                error_message: '',
                quote_text: '',
                quote_author: '',
                tags: [],
                attrs: {
                    class: 'mb-3',
                    boilerplate: false,
                    elevation: 3,
                  },
                show: false,
                dialog: false,
                dialog_quote: false,
                quote_text_sel: '',
                quote_author_sel: '',
                quote_date_sel: '',
                quote_tags_sel: [],
                quote_format: '',
                errors: null,
                activator: null,
                attach: null,
                items: [
                    { 
                        header: 'Выберите тег'
                    },
                ],
                tagList: [],
                errs: [],
                fieldsErrs: [],
                menu: false,
                model: [
                ],
                x: 0,
                search: null,
                y: 0,
            };
        },
        mounted() {
            this.loadQuotes(this.page);
        },
        methods: {
            loadQuotes: function(page) {
                this.loading = true;
                axios.get(`/api/quotes?page=`+ page)
                    .then((response) => {
                        // console.log(response);
                        if (response.data.last_page != null) {
                            this.totalPages = response.data.last_page;
                            this.currentPage = response.data.current_page;
                            this.loading = false;
                        }
                        if (response.data.data != null) {
                                this.quotes = response.data.data;
                                this.loading = false;
                                // console.log(this.quotes);
                            }
                    });
            },
            loadTags: function() {
                axios.get(`/api/tags`)
                    .then((response) => {
                        // console.log(response);
                        if (response.data != null) {
                                this.tagList = response.data;
                                this.items = [];
                                this.items.push({ 
                                    header: 'Выберите тег'
                                });
                                // this.tagList.forEach(element => console.log(element));
                                this.tagList.forEach(element => this.items.push({
                                    text: element.name,
                                    id: element.id
                                }));
                                this.model = [];
                                this.model.push(this.items[1]);
                                // console.log(this.items);
                            }
                    });
            },
            addQuote: function() {
                this.loadTags();
                this.dialog = true;
                this.error_alert = false;
            },
            publishQuote: function() {
                this.tags = [];
                this.model.forEach(element => this.tags.push(element.id));
                axios
                    .post(`api/quote/store`, {
                        quote: {
                            text: this.quote_text,
                            author: this.quote_author,
                        },
                        tags: this.tags,
                    })
                    .then((response) => {
                        // console.log(response);
                        if (response.data.error != null) {
                            this.error_message = '';
                            this.error_message = "Пожалуйста, заполните все поля";
                            this.error_alert = true;
                        } else {
                            this.dialog = false;
                            this.quote_text = '';
                            this.quote_author = '';
                            this.model = [];
                            this.loadQuotes(this.page);
                        }
                    })
                    .catch((error) => {
                        this.error_message = error;
                        this.error_alert = true;
                    }); 
            },
            openQuote: function(id) {
                // console.log(id);
                this.dialog_quote = true;
                // this.quote_text_1 = id;
                this.loadQuoteById(id);
            },
            loadQuoteById: function(id) {
                this.quote_tags_sel = [];
                axios.get(`/api/quote/show/` + id)
                    .then((response) => {
                        // console.log(response);
                        this.quote_text_sel = response.data.text;
                        this.quote_author_sel = response.data.author;
                        this.quote_date_sel = response.data.date;
                        this.quote_tags_sel = response.data.tags; 
                        this.quote_format = `\"` +response.data.text + `\"` + ' ' + `©` + ' ' + response.data.author;
                    });
            },
            filter (item, queryText, itemText) {
                if (item.header) return false

                const hasValue = val => val != null ? val : ''

                const text = hasValue(itemText)
                const query = hasValue(queryText)

                return text.toString()
                    .toLowerCase()
                    .indexOf(query.toString().toLowerCase()) > -1
            },
            handlePageChange(value) {
                this.page = value;
                this.loadQuotes(value);
            },
            changer (items) {
                if (this.model.length > 3) {
                    this.model.splice(-1,1);
                    this.items[0].header = 'Выбрано максимальное количество тегов';
                }
                else this.items[0].header = 'Выберите тег';
                if (typeof items[items.length - 1] !== 'object') this.model.splice(-1,1);
                if (this.model.length > 0) this.errors = null;
                if (this.model.length == 0) this.errors = "Необходимо выбрать хотя бы 1 тег!";
            },
        }
    };
</script>

<style type="text/css">
    .tbltdtop {
        vertical-align: top;
    }
</style>