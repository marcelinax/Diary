"use strict";
class Page {
  constructor(title = "", content = "", date = new Date()) {
    this.title = title;
    this.content = content;
    this.date = date;
  }
  render(titleEl, contentEl, dateEl, lettersEl, buttonEl) {
    titleEl.style.display = "flex";
    contentEl.style.display = "flex";
    dateEl.style.display = "flex";
    lettersEl.style.display = "flex";
    buttonEl.style.display = "none";
    titleEl.value = this.title;
    contentEl.value = this.content;
    dateEl.innerHTML = this.date;
    lettersEl.innerHTML = `${this.content.length}/500`;
  }
}

class Diary {
  pages = [];
  currentPageIndex = -1;
  constructor() {
    this.readPages();
  }
  addPage() {
    this.pages.push(new Page());
    this.savePages();
  }
  savePages() {
    localStorage.setItem("pages", JSON.stringify(this.pages));
  }
  readPages() {
    this.pages = [];
    const localPages = localStorage.getItem("pages");
    if (localPages) {
      const pagesShapes = JSON.parse(localPages);
      pagesShapes.forEach((pageShape) => {
        const page = new Page(
          pageShape.title,
          pageShape.content,
          pageShape.date
        );
        this.pages.push(page);
      });
      this.currentPageIndex = 0;
    }
  }
  renderCurrentPages(firstPageElements, secondPageElements) {
    if (
      this.currentPageIndex > -1 &&
      this.currentPageIndex < this.pages.length
    ) {
      this.pages[this.currentPageIndex].render(
        firstPageElements.titleEl,
        firstPageElements.contentEl,
        firstPageElements.dateEl,
        firstPageElements.lettersEl,
        firstPageElements.buttonEl
      );
      if (this.currentPageIndex + 1 < this.pages.length) {
        this.pages[this.currentPageIndex + 1].render(
          secondPageElements.titleEl,
          secondPageElements.contentEl,
          secondPageElements.dateEl,
          secondPageElements.lettersEl,
          secondPageElements.buttonEl
        );
      } else {
        this.renderEmptyPage(
          secondPageElements.titleEl,
          secondPageElements.contentEl,
          secondPageElements.dateEl,
          secondPageElements.lettersEl,
          secondPageElements.buttonEl
        );
      }
    } else {
      this.renderEmptyPage(
        firstPageElements.titleEl,
        firstPageElements.contentEl,
        firstPageElements.dateEl,
        firstPageElements.lettersEl,
        firstPageElements.buttonEl
      );
      this.hidePage(
        secondPageElements.titleEl,
        secondPageElements.contentEl,
        secondPageElements.dateEl,
        secondPageElements.lettersEl,
        secondPageElements.buttonEl
      );
    }
  }
  renderEmptyPage(titleEl, contentEl, dateEl, lettersEl, buttonEl) {
    titleEl.style.display = "none";
    contentEl.style.display = "none";
    dateEl.style.display = "none";
    lettersEl.style.display = "none";
    buttonEl.style.display = "flex";
  }
  hidePage(titleEl, contentEl, dateEl, lettersEl, buttonEl) {
    titleEl.style.display = "none";
    contentEl.style.display = "none";
    dateEl.style.display = "none";
    lettersEl.style.display = "none";
    buttonEl.style.display = "none";
  }
}

class UI {
  firstPageElements = {
    titleEl: document.querySelector(".first-page .title"),
    contentEl: document.querySelector(".first-page .content"),
    dateEl: document.querySelector(".first-page .date"),
    lettersEl: document.querySelector(".first-page .letters"),
    buttonEl: document.querySelector(".first-page .add-page"),
  };
  secondPageElements = {
    titleEl: document.querySelector(".second-page .title"),
    contentEl: document.querySelector(".second-page .content"),
    dateEl: document.querySelector(".second-page .date"),
    lettersEl: document.querySelector(".second-page .letters"),
    buttonEl: document.querySelector(".second-page .add-page"),
  };
  previousBtn = document.getElementById("previous");
  nextBtn = document.getElementById("next");
  firstPageIndex = document.getElementById("first-page-index");
  secondPageIndex = document.getElementById("second-page-index");
  diary = new Diary();
  constructor() {
    this.initAddPageBtn();
    this.initChangePreviousPage();
    this.initChangeNextPage();
    this.initEditFirstPage();
    this.initEditSecondPage();
    this.renderCurrent();
  }
  renderCurrent() {
    this.diary.renderCurrentPages(
      this.firstPageElements,
      this.secondPageElements
    );
    this.firstPageIndex.innerHTML = this.diary.currentPageIndex + 1;
    this.secondPageIndex.innerHTML = this.diary.currentPageIndex + 2;
  }
  initAddPageBtn() {
    this.firstPageElements.buttonEl.addEventListener("click", () => {
      this.diary.addPage();
      this.renderCurrent();
    });
    this.secondPageElements.buttonEl.addEventListener("click", () => {
      this.diary.addPage();
      this.renderCurrent();
    });
  }
  initChangePreviousPage() {
    this.previousBtn.addEventListener("click", () => {
      if (this.diary.currentPageIndex > 1) {
        this.diary.currentPageIndex -= 2;
      }
      this.renderCurrent();
    });
  }
  initChangeNextPage() {
    this.nextBtn.addEventListener("click", () => {
      if (this.diary.currentPageIndex + 1 < this.diary.pages.length) {
        this.diary.currentPageIndex += 2;
      }
      this.renderCurrent();
    });
  }
  initEditFirstPage() {
    this.firstPageElements.titleEl.addEventListener("keyup", () => {
      this.diary.pages[this.diary.currentPageIndex].title =
        this.firstPageElements.titleEl.value;
      this.diary.savePages();
      this.renderCurrent();
    });
    this.firstPageElements.contentEl.addEventListener("keyup", () => {
      if (this.firstPageElements.contentEl.value.length <= 500) {
        this.diary.pages[this.diary.currentPageIndex].content =
          this.firstPageElements.contentEl.value;
        this.diary.savePages();
        this.renderCurrent();
      } else {
        this.firstPageElements.contentEl.value =
          this.diary.pages[this.diary.currentPageIndex].content;
      }
    });
  }
  initEditSecondPage() {
    this.secondPageElements.titleEl.addEventListener("keyup", () => {
      this.diary.pages[this.diary.currentPageIndex + 1].title =
        this.secondPageElements.titleEl.value;
      this.diary.savePages();
      this.renderCurrent();
    });
    this.secondPageElements.contentEl.addEventListener("keyup", () => {
      if (this.secondPageElements.contentEl.value.length <= 500) {
        this.diary.pages[this.diary.currentPageIndex + 1].content =
          this.secondPageElements.contentEl.value;
        this.diary.savePages();
        this.renderCurrent();
      } else {
        this.secondPageElements.contentEl.value =
          this.diary.pages[this.diary.currentPageIndex + 1].content;
      }
    });
  }
}

const ui = new UI();
