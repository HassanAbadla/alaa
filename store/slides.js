export const state = () => ({
  slides: [],
  selectedSlide: null,
});

export const mutations = {
  setSlides(state, slides) {
    state.slides = slides;
  },
  ADD_SLIDE(state, slide) {
    state.slides.push(slide);
  },
  UPDATE_SLIDE(state, slide) {
    const index = state.slides.findIndex((s) => s.id === slide.id);
    if (index !== -1) {
      state.slides[index] = slide;
    }
  },
  REMOVE_SLIDE(state, id) {
    state.slides = state.slides.filter((s) => s.id !== id);
  },
};

export const actions = {
  async fetchSlides({ commit }, id) {
    const slides = await this.$axios.$get("/slides/" + id);
    commit("setSlides", slides.data);
  },
  async addSlide({ commit }, slide) {
    const res = await this.$axios.post("/slide/store", slide);
    commit("ADD_SLIDE", res.data.data);
  },
  async updateSlide({ commit }, { id, payload }) {
    const res = await this.$axios.post(`/slide/update/${id}`, payload);
    commit("UPDATE_SLIDE", res.data.data);
  },
  async deleteSlide({ commit }, id) {
    const res = await this.$axios.delete(`/slide/delete/${id}`);
    commit("REMOVE_SLIDE", id);
  },
};
