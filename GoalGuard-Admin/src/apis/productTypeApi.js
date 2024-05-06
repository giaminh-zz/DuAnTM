import axiosClient from './axiosClient';

const productTypeAPI = {
  async addProductType(data) {
    try {
      const response = await axiosClient.post('/product-types/add', data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async updateProductType(data, id) {
    try {
      const response = await axiosClient.put(`/product-types/update/${id}`, data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async deleteProductType(id) {
    try {
      const response = await axiosClient.delete(`/product-types/delete/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async getProductTypeById(id) {
    try {
      const response = await axiosClient.get(`/product-types/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async getAllProductTypes() {
    try {
      const response = await axiosClient.get('/product-types');
      return response;
    } catch (error) {
      throw error;
    }
  },
  async searchProductTypes(keyword) {
    try {
      const response = await axiosClient.get('/product-types/search', { params: { keyword } });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default productTypeAPI;
