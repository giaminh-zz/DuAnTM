import {
  Breadcrumb, Button, Card, Col, Form,
  List, Row,
  Spin
} from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import React, { useEffect, useState } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import axiosClient from "../../../apis/axiosClient";
import productApi from "../../../apis/productApi";
import triangleTopRight from "../../../assets/icon/Triangle-Top-Right.svg";
import { numberWithCommas } from "../../../utils/common";
import "./productList.css";
import areaManagementApi from "../../../apis/areaManagementApi";
import courtsManagementApi from "../../../apis/courtsManagementApi";


const ProductList = () => {
  const [productDetail, setProductDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);

  let { id } = useParams();
  const history = useHistory();
  const match = useRouteMatch();

  const handleReadMore = (id) => {
    console.log(id);
    history.push("/product-detail/" + id);
    window.location.reload();
  };

  const handleCategoryDetails = (id) => {
    const newPath = match.url.replace(/\/[^/]+$/, `/${id}`);
    history.push(newPath);
    window.location.reload();
  };




  const handleSearchClick = async () => {
    await courtsManagementApi.getAllCourts().then((response) => {

      // Cập nhật state với danh sách sản phẩm chỉ có trạng thái 'Available'
      setProductDetail(response);
    });
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await areaManagementApi.getAllAreas();
        setCategories(response);
        await courtsManagementApi.getCourtByCategory(id).then((response) => {

          // Cập nhật state với danh sách sản phẩm chỉ có trạng thái 'Available'
          setProductDetail(response);
        });


        setLoading(false);
      } catch (error) {
        console.log("Failed to fetch event detail:" + error);
      }
    })();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Spin spinning={false}>
        <Card className="container_details">
          <div className="product_detail">
            <div style={{ marginLeft: 5, marginBottom: 10, marginTop: 10 }}>
              <Breadcrumb>
                <Breadcrumb.Item href="http://localhost:3500/home">
                  <span>Trang chủ</span>
                </Breadcrumb.Item>
                <Breadcrumb.Item href="">
                  <span>Sản phẩm </span>
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <hr></hr>
            <div className="container box">
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleCategoryDetails(category.id)}
                  className="menu-item-1"
                >
                  <div className="menu-category-1">{category.name}</div>
                </div>
              ))}
            </div>
            <div
              className="list-products container"
              key="1"
              style={{ marginTop: 0, marginBottom: 50 }}
            >
              <Row>
                <Col span={12}>
                  <div className="title-category">
                    <div class="title">
                      <h3 style={{ paddingTop: "30px" }}>Danh sách sân bóng</h3>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="button-category">
                    <Button type="primary" onClick={() => handleSearchClick()}>
                      Tất cả sân bóng
                    </Button>
                  </div>
                </Col>
              </Row>
              <div key="1" style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gridGap: '25px' }}>
                {productDetail.slice(0, 20).map((item) => (
                  <div
                    className='col-product'
                    onClick={() => handleReadMore(item.id)}
                    key={item.id}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="show-product">
                      {item.image ? (
                        <img
                          className='image-product'
                          src={item.image}
                          alt={item.name}
                        />
                      ) : (
                        <img
                          className='image-product'
                          src={require('../../../assets/image/NoImageAvailable.jpg')}
                          alt="No Image Available"
                        />
                      )}
                      <div className='wrapper-products'>
                        <Paragraph
                          className='title-product'
                          ellipsis={{ rows: 2 }}
                        >
                          {item.name}
                        </Paragraph>

                        <div>Khu vực: {item.area}</div>
                        <div>Loại sân: {item.field_type}</div>

                        <div className="price-amount">
                          <Paragraph className='price-product'>
                            {numberWithCommas(item.price)}đ/giờ
                          </Paragraph>
                        </div>
                      </div>


                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </Spin>
    </div>
  );
};

export default ProductList;
