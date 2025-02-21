import { AxiosInstance, AxiosPromise, AxiosResponse } from "axios";
import { axios } from "./common";
import { baseEndpoint, liveEndpoint } from "./common";
import { bagelType, fileUploadArgs, structArgs } from "./interfaces";
export default class BagelDBRequest {
  instance: bagelType;
  collectionID: string;
  _pageNumber: number;
  itemsPerPage: number;
  callEverything: boolean;
  _query: any[];
  nestedCollectionsIDs: any[];
  axiosInstance: AxiosInstance;
  apiToken: string;
  _projectOn: string;
  _projectOff: string;
  requestID: string;
  client!: EventSource;
  _item: any;
  _field: any;
  sortField: string;
  sortOrder: string;
  [x: string]: any;

  constructor({ instance, collectionID }: structArgs) {
    this.instance = instance;
    this.collectionID = collectionID;
    this._pageNumber = 1;
    this.itemsPerPage = 100;
    this.callEverything = false;
    this._query = [];
    this.nestedCollectionsIDs = [];
    this.axiosInstance = axios.create();
    this.apiToken = instance.apiToken;
    this._projectOn = "";
    this._projectOff = "";
    this.requestID = "";
    this.sortField = "";
    this.sortOrder = "";
    // this.client;
    this._item;
    this._field;
  }
  // Pagination
  pageNumber(pageNumber) {
    this._pageNumber = pageNumber;
    return this;
  }

  perPage(perPage) {
    this.itemsPerPage = perPage;
    return this;
  }

  everything() {
    this.callEverything = true;
    return this;
  }

  collection(collectionSlug) {
    this.nestedCollectionsIDs.push(collectionSlug);
    return this;
  }

  item(_id) {
    if (!_id) throw "item cant be " + _id;
    if (this._item) {
      if (this.nestedCollectionsIDs.length % 2 === 0)
        throw "a nested item can only be placed after a nested collection";
      this.nestedCollectionsIDs.push(_id);
    } else {
      this._item = _id;
    }
    return this;
  }

  query(key, operator, value) {
    if (!key) return this;
    if (Array.isArray(value)) value = value.join(",");
    const query = key + ":" + operator + ":" + value;
    this._query.push(encodeURIComponent(query));
    return this;
  }

  sort(field, order) {
    this.sortField = field;
    this.sortOrder = order || "";
    return this;
  }

  projectOn(slugs) {
    this._projectOn = slugs;
    return this;
  }

  projectOff(slugs) {
    this._projectOff = slugs;
    return this;
  }

  // Either of imageLink or selectedImage must be used
  // selectedImage expects a file stream i.e fs.createReadStream(filename)
  uploadImage(imageSlug: string, { selectedImage, imageLink, altText, fileName }: fileUploadArgs): AxiosPromise {
    const isNode = new Function("try {return this===global;}catch(e){return false;}");
    let form;
    if (isNode()) {
      const FormData = require('form-data');
			form = new FormData();
    } else {
      form = new FormData();
    }
    const nestedID = this.nestedCollectionsIDs.join(".");
    if (altText) {
      form.append("altText", altText);
    }
    if (imageLink) {
      form.append("imageLink", imageLink);
    } else {
      form.append("imageFile", selectedImage, fileName);
    }
    let formHeaders;
    if (isNode()) {
      formHeaders = form.getHeaders();
    }
    return new Promise((resolve, reject) => {
      const url = `${baseEndpoint}/collection/${this.collectionID}/items/${this._item}/image?imageSlug=${imageSlug}&nestedID=${nestedID}`;
      this.instance.axiosInstance
        .put(url, form, { headers: formHeaders })
        .then((imgResponse) => {
          resolve(imgResponse);
        })
        .catch((err) => reject(err));
    });
  }

  delete() {
    const nestedID = this.nestedCollectionsIDs.join(".");
    let url = `${baseEndpoint}/collection/${this.collectionID}/items/${this._item}`;
    if (nestedID) url = url + `?nestedID=${nestedID}`;
    return new Promise((resolve, reject) => {
      this.instance.axiosInstance
        .delete(url)
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }

  set(data: Record<string, any>): AxiosPromise {
    const nestedID = this.nestedCollectionsIDs.join(".");
    let url = `${baseEndpoint}/collection/${this.collectionID}/items/${this._item}?set=true`;
    if (nestedID) url = url + `&nestedID=${nestedID}`;
    return new Promise((resolve, reject) => {
      this.instance.axiosInstance
        .put(url, JSON.stringify(data))
        .then(async (res) => {
          resolve(res);
        })
        .catch((err) => reject(err));
    });
  }

  put(data: Record<string, any>): AxiosPromise {
    const nestedID = this.nestedCollectionsIDs.join(".");
    let url = `${baseEndpoint}/collection/${this.collectionID}/items/${this._item}`;
    if (nestedID) url = url + `?nestedID=${nestedID}`;
    return new Promise((resolve, reject) => {
      this.instance.axiosInstance
        .put(url, JSON.stringify(data))
        .then(async (res) => {
          resolve(res);
        })
        .catch((err) => reject(err));
    });
  }

  post(data: Record<string, any>): AxiosPromise {
    const nestedID = this.nestedCollectionsIDs.join(".");
    return new Promise((resolve, reject) => {
      let url = `${baseEndpoint}/collection/${this.collectionID}/items`;
      if (nestedID) url = url + `/${this._item}?nestedID=${nestedID}`;
      this.instance.axiosInstance
        .post(url, data)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  append(fieldSlug, value): AxiosPromise {
    const nestedID = this.nestedCollectionsIDs.join(".");
    return new Promise((resolve, reject) => {
      let url = `${baseEndpoint}/collection/${this.collectionID}/items/${this._item}/field/${fieldSlug}`;
      if (nestedID) url = url + `?nestedID=${nestedID}`;
      this.instance.axiosInstance
        .put(url, { value: value })
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  field(fieldSlug) {
    if (!fieldSlug || fieldSlug.match(/\s/)) throw "field slug cant be " + fieldSlug;
    this._field = fieldSlug;
    return this;
  }

  increment(incrementValue): AxiosPromise {
    if (!this._field) throw "field must be set to use the increment method";
    if (isNaN(parseFloat(incrementValue))) throw "Increment value must be a number";
    const nestedID = this.nestedCollectionsIDs.join(".");
    return new Promise((resolve, reject) => {
      let url = `${baseEndpoint}/collection/${this.collectionID}/items/${this._item}/field/${this._field}?increment=${incrementValue}`;
      if (nestedID) url = url + `&nestedID=${nestedID}`;
      this.instance.axiosInstance
        .put(url)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  decrement(decrementValue): AxiosPromise {
    if (!this._field) throw "field must be set to use the decrement method";
    if (typeof decrementValue == "string") decrementValue = parseFloat(decrementValue);
    if (isNaN(decrementValue)) throw "Increment value must be a number";
    if (decrementValue > 0) decrementValue = decrementValue * -1;
    const nestedID = this.nestedCollectionsIDs.join(".");
    return new Promise((resolve, reject) => {
      let url = `${baseEndpoint}/collection/${this.collectionID}/items/${this._item}/field/${this._field}?increment=${decrementValue}`;
      if (nestedID) url = url + `&nestedID=${nestedID}`;
      this.instance.axiosInstance
        .put(url)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  unset(fieldSlug, value): AxiosPromise {
    const nestedID = this.nestedCollectionsIDs.join(".");
    if (nestedID) throw "Unset is not yet supported in nested collections";
    return new Promise((resolve, reject) => {
      let url = `${baseEndpoint}/collection/${this.collectionID}/items/${this._item}/field/${fieldSlug}`;
      if (nestedID) url = url + `?nestedID=${nestedID}`;
      this.instance.axiosInstance
        .delete(url, { data: { value: value } })
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  value(fieldSlug, value): AxiosPromise {
    const nestedID = this.nestedCollectionsIDs.join(".");
    return new Promise((resolve, reject) => {
      let url = `${baseEndpoint}/collection/${this.collectionID}/items/${this._item}/field/${fieldSlug}`;
      if (nestedID) url = url + `?nestedID=${nestedID}`;
      this.instance.axiosInstance
        .delete(url, { data: { value: value } })
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  get(): AxiosPromise {
    return new Promise((resolve, reject) => {
      const params = new URLSearchParams();
      const nestedID = this.nestedCollectionsIDs.join(".");
      this._pageNumber ? params.append("pageNumber", String(this._pageNumber)) : "";
      this.sortField ? params.append("sort", this.sortField) : "";
      this.sortOrder ? params.append("order", this.sortOrder) : "";
      this.itemsPerPage ? params.append("perPage", String(this.itemsPerPage)) : "";
      this.callEverything ? params.append("everything", String(this.callEverything)) : "";
      this._projectOff != "" ? params.append("projectOff", this._projectOff) : "";
      this._projectOn != "" ? params.append("projectOn", this._projectOn) : "";

      const itemID = this._item ? "/" + this._item : "";

      let url = `${baseEndpoint}/collection/${this.collectionID}/items${itemID}?${params.toString()}`;
      if (this._query.length > 0) url = url + "&query=" + this._query.join("%2B");
      if (nestedID) url = url + `&nestedID=${nestedID}`;

      this.instance.axiosInstance
        .get(url)
        .then((res) => {
          if (res.status >= 200 && res.status < 400) {
            resolve(res);
          } else {
            reject(res);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  users(): AxiosPromise {
    if (!this._item) {
      throw new Error("Users can only be retrieved in relation to an item");
    }
    const nestedID = this.nestedCollectionsIDs.join(".");
    return new Promise((resolve, reject) => {
      let url = `${baseEndpoint}/collection/${this.collectionID}/items/${this._item}/bagelUsers`;
      if (nestedID) url = url + `?nestedID=${nestedID}`;
      this.instance.axiosInstance
        .get(url)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  addUser(bagelUserID): AxiosPromise {
    if (!this._item) {
      throw new Error("Users can only be added in relation to an item");
    }
    const nestedID = this.nestedCollectionsIDs.join(".");
    return new Promise((resolve, reject) => {
      let url = `${baseEndpoint}/collection/${this.collectionID}/items/${this._item}/bagelUsers`;
      if (nestedID) url = url + `?nestedID=${nestedID}`;
      this.instance.axiosInstance
        .put(url, { userID: bagelUserID })
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  removeUser(bagelUserID): AxiosPromise {
    if (!this._item) {
      throw new Error("Users can only be removed in relation to an item");
    }
    const nestedID = this.nestedCollectionsIDs.join(".");
    return new Promise((resolve, reject) => {
      let url = `${baseEndpoint}/collection/${this.collectionID}/items/${this._item}/bagelUsers`;
      if (nestedID) url = url + `?nestedID=${nestedID}`;
      this.instance.axiosInstance
        .delete(url, { data: { userID: bagelUserID } })
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // Client is returned. It must be closed when it is no longer required using client.close()
  // onmessage and onerror are callback functions to process the data
  // see https://developer.mozilla.org/en-US/docs/Web/API/EventSource for more info on Server Side Events (SSE)
  async listen(onmessage: (...args: any) => unknown, onerror: (...args: any) => unknown) {
    if (!onmessage) {
      throw new Error("onMessage callback must be defined");
    }

    let token: string | null | AxiosResponse<string, any>;
    if (await this.instance.users()._bagelUserActive()) token = await this.instance.users()._getAccessToken();
    else token = this.apiToken;

    const nestedID = this.nestedCollectionsIDs.join(".");

    const url =
      liveEndpoint +
      `/collection/${this.collectionID}/live?authorization=${token}&nestedID=${nestedID}&itemID=${this._item}`;
    this.client = new EventSource(url);
    const that = this;

    const errorHandler = async (event) => {
      if (that.client.readyState === EventSource.CLOSED) {
        if (await that.instance.users()._bagelUserActive()) {
          await that.instance.users().refresh();
          token = await that.instance.users()._getAccessToken();
          const url =
            liveEndpoint +
            `/collection/${that.collectionID}/live?authorization=${token}&requestID=${that.requestID}&nestedID=${nestedID}&itemID=${that._item}`;
          that.client = new EventSource(url);
          return;
        }
      }
      if (onerror) {
        onerror(event);
      }
    };

    this.client.addEventListener("start", function (e: Event & Record<string, any>) {
      that.requestID = e.data;
    });

    this.client.addEventListener("stop", async () => {
      if (await that.instance.users()._bagelUserActive()) token = await that.instance.users()._getAccessToken();
      else token = that.apiToken;

      that.client.close();
      const url =
        liveEndpoint +
        `/collection/${that.collectionID}/live?authorization=${token}&requestID=${that.requestID}&nestedID=${nestedID}&itemID=${that._item}`;
      that.client = new EventSource(url);
      that.client.onmessage = onmessage;
      that.client.onerror = errorHandler;
    });

    this.client.onmessage = onmessage;
    this.client.onerror = errorHandler;
    return this.client;
  }
}
