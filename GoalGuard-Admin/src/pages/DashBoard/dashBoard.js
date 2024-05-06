import {
    ContactsTwoTone,
    DashboardOutlined,
    EnvironmentTwoTone,
    FolderOpenTwoTone,
    HddTwoTone,
    HomeOutlined,
    NotificationTwoTone,
    ShopTwoTone,
    ShoppingTwoTone
} from '@ant-design/icons';
import {
    BackTop,
    Breadcrumb,
    Card,
    Col,
    Row,
    Spin,
    Tag
} from 'antd';
import React, { useEffect, useState } from 'react';
import dashBoardApi from "../../apis/dashBoardApi";
import "./dashBoard.css";
import fieldtypesApi from '../../apis/fieldtypesApi';
import areaManagementApi from '../../apis/areaManagementApi';
import productTypeAPI from '../../apis/productTypeApi';
import productAPI from '../../apis/productApi';
import tournamentApi from '../../apis/tournamentApi';
import courtsManagementApi from '../../apis/courtsManagementApi';


const DashBoard = () => {
    const [statisticList, setStatisticList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotalList] = useState();
    const [area, setArea] = useState(null);
    const [type, setType] = useState(null);
    const [tournament, setTournament] = useState(null);
    const [product, setProduct] = useState(null);
    const [courts, setCourts] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                
                await fieldtypesApi.getAllFieldTypes().then((res) => {
                    console.log(res);
                    setTotalList(res)
                    setLoading(false);
                });

                await productTypeAPI.getAllProductTypes().then((res) => {
                    console.log(res);
                    setType(res)
                    setLoading(false);
                });

                
                await productAPI.getAllProducts().then((res) => {
                    console.log(res);
                    setProduct(res)
                    setLoading(false);
                });

                await courtsManagementApi.getAllCourts().then((res) => {
                    console.log(res);
                    setCourts(res)
                    setLoading(false);
                });

                await areaManagementApi.getAllAreas().then((res) => {
                    console.log(res);
                    setArea(res)
                    setLoading(false);
                });

                await tournamentApi.getAllTournaments().then((res) => {
                    console.log(res);
                    setTournament(res)
                    setLoading(false);
                });

                await dashBoardApi.getAssetStatistics().then((res) => {
                    console.log(res);
                    setStatisticList(res);
                    setLoading(false);
                });

            } catch (error) {
                console.log('Failed to fetch event list:' + error);
            }
        })();
    }, [])
    return (
        <div>
            <Spin spinning={false}>
                <div className='container'>
                    <div style={{ marginTop: 20 }}>
                        <Breadcrumb>
                            <Breadcrumb.Item href="">
                                <HomeOutlined />
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="">
                                <DashboardOutlined />
                                <span>DashBoard</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <Row gutter={12} style={{ marginTop: 20 }}>
                        <Col span={6}>
                            <Card className="card_total" bordered={false}>
                                <div className='card_number'>
                                    <div>
                                        <div className='number_total'>{statisticList?.userCount}</div>
                                        <div className='title_total'>Số thành viên</div>
                                    </div>
                                    <div>
                                        <ContactsTwoTone style={{ fontSize: 48 }} />
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card className="card_total" bordered={false}>
                                <div className='card_number'>
                                    <div>
                                        <div className='number_total'>{total?.length}</div>
                                        <div className='title_total'>Tổng loại sân</div>
                                    </div>
                                    <div>
                                        <NotificationTwoTone style={{ fontSize: 48 }} />
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        
                        <Col span={6}>
                            <Card className="card_total" bordered={false}>
                                <div className='card_number'>
                                    <div>
                                        <div className='number_total'>{area?.length}</div>
                                        <div className='title_total'>Số khu vực</div>
                                    </div>
                                    <div>
                                        <EnvironmentTwoTone style={{ fontSize: 48 }} />
                                    </div>
                                </div>
                            </Card>
                        </Col>

                        <Col span={6}>
                            <Card className="card_total" bordered={false}>
                                <div className='card_number'>
                                    <div>
                                        <div className='number_total'>{type?.length}</div>
                                        <div className='title_total'>Số loại dịch vụ</div>
                                    </div>
                                    <div>
                                        <ShoppingTwoTone style={{ fontSize: 48 }} />
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={12} style={{ marginTop: 20 }}>
                        <Col span={6}>
                            <Card className="card_total" bordered={false}>
                                <div className='card_number'>
                                    <div>
                                        <div className='number_total'>{product?.length}</div>
                                        <div className='title_total'>Số dịch vụ</div>
                                    </div>
                                    <div>
                                        <FolderOpenTwoTone style={{ fontSize: 48 }} />
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card className="card_total" bordered={false}>
                                <div className='card_number'>
                                    <div>
                                        <div className='number_total'>{tournament?.length}</div>
                                        <div className='title_total'>Tổng số giải đấu</div>
                                    </div>
                                    <div>
                                        <HddTwoTone style={{ fontSize: 48 }} />
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        
                        <Col span={6}>
                            <Card className="card_total" bordered={false}>
                                <div className='card_number'>
                                    <div>
                                        <div className='number_total'>{courts?.length}</div>
                                        <div className='title_total'>Số giải đấu</div>
                                    </div>
                                    <div>
                                        <ShopTwoTone style={{ fontSize: 48 }} />
                                    </div>
                                </div>
                            </Card>
                        </Col>

                        {/* <Col span={6}>
                            <Card className="card_total" bordered={false}>
                                <div className='card_number'>
                                    <div>
                                        <div className='number_total'>{type?.length}</div>
                                        <div className='title_total'>Số loại dịch vụ</div>
                                    </div>
                                    <div>
                                        <ShopTwoTone style={{ fontSize: 48 }} />
                                    </div>
                                </div>
                            </Card>
                        </Col> */}
                    </Row>
                </div>
                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default DashBoard;