import {
    DeleteOutlined,
    EditOutlined,
    HomeOutlined,
    PlusOutlined,
    ShoppingOutlined,
    CheckCircleOutlined,
    StopOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-layout';
import {
    BackTop, Breadcrumb,
    Button,
    Col,
    Form,
    Input,
    Modal, Popconfirm,
    Row,
    Space,
    Spin,
    Table,
    notification,
    Select,
    InputNumber
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import courtsManagementApi from "../../../apis/courtsManagementApi";
import "./assetManagement.css";
import fieldtypesApi from '../../../apis/fieldtypesApi';
import uploadFileApi from '../../../apis/uploadFileApi';
import userApi from '../../../apis/userApi';
import { useHistory, useParams } from "react-router-dom";

const { Option } = Select;

const AssetManagement = () => {

    const [category, setCategory] = useState([]);
    const [fieldTypes, setFieldTypes] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();
    const [file, setUploadFile] = useState();

    const showModal = () => {
        setOpenModalCreate(true);
    };

    const handleOkUser = async (values) => {
        setLoading(true);
        try {
            const categoryList = {
                "name": values.name,
                "description": values.description,
                "value": values.value,
                "location": values.location,
                "status": values.status,
                "categoryId": values.categoryId,
                "quantity": values.quantity || 0,
                "image": file
            }
            return courtsManagementApi.addCourt(categoryList).then(response => {
                if (response.message === "Asset with the same name already exists") {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tên sân bóng không được trùng',
                    });
                    setLoading(false);
                    return;
                }
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tạo sân bóng thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Tạo sân bóng thành công',
                    });
                    setOpenModalCreate(false);
                    handleCategoryList();
                }
            })

        } catch (error) {
            throw error;
        }
    }

    const handleUpdateCategory = async (values) => {
        setLoading(true);
        try {
            const categoryList = {
                "name": values.name,
                "description": values.description,
                "value": values.value,
                "location": values.location,
                "status": values.status,
                "categoryId": values.categoryId,
                "quantity": values.quantity,
                "image": file
            }
            return courtsManagementApi.updateCourt(categoryList, id).then(response => {
                if (response.message === "Asset with the same name already exists") {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tên sân bóng không được trùng',
                    });
                    setLoading(false);
                    return;
                }

                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa sân bóng thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa sân bóng thành công',
                    });
                    handleCategoryList();
                    setOpenModalUpdate(false);
                }
            })

        } catch (error) {
            throw error;
        }
    }

    const handleCancel = (type) => {
        if (type === "create") {
            setOpenModalCreate(false);
        } else {
            setOpenModalUpdate(false)
        }
        console.log('Clicked cancel button');
    };

    const handleCategoryList = async () => {
        try {
            await courtsManagementApi.getAllCourts().then((res) => {
                setCategory(res);
                setLoading(false);
            });
            ;
        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        };
    }

    const handleDeleteCategory = async (id) => {
        setLoading(true);
        try {
            await courtsManagementApi.deleteCourt(id).then(response => {
                if (response.message === "Cannot delete the asset because it is referenced in another process or event.") {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            "Không thể xóa sân bóng vì nó đã được sử dụng trong một sân bóng hoặc quá trình khác.",

                    });
                    setLoading(false);
                    return;
                }
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Xóa sân bóng thất bại',

                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Xóa sân bóng thành công',

                    });
                    handleCategoryList();
                    setLoading(false);
                }
            }
            );

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const handleEditCategory = (id) => {
        setOpenModalUpdate(true);
        (async () => {
            try {
                const response = await courtsManagementApi.getCourtById(id);
                setId(id);
                form2.setFieldsValue({
                    name: response.data.name,
                    description: response.data.description,
                    value: response.data.value,
                    location: response.data.location,
                    status: response.data.status,
                    categoryId: response.data.category_id,
                    quantity: response.data.quantity,
                    image: response.data.image
                });
                console.log(form2);
                setLoading(false);
            } catch (error) {
                throw error;
            }
        })();
    }

    const handleFilter = async (name) => {
        try {
            const res = await courtsManagementApi.searchCourts(name);
            setCategory(res.data);
        } catch (error) {
            console.log('search to fetch category list:' + error);
        }
    }

    const handleUnBanAccount = async (data) => {
        console.log(data);

        try {
            await courtsManagementApi.banAccount(data.id).then(response => {
                if (response.message === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Phê duyệt thất bại',

                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Phê duyệt thành công',

                    });
                }
                handleCategoryList();
            }
            );

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const handleBanAccount = async (data) => {
        console.log(data);
        try {
            await courtsManagementApi.unBanAccount(data.id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Từ chối thất bại',

                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Từ chối thành công',

                    });
                }
                handleCategoryList();

            }
            );

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const columns = [
        {
            title: 'ID',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (image) => <img src={image} style={{ height: 80 }} />,
            width: '10%'
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Khu vực',
            dataIndex: 'id_areas',
            key: 'id_areas',
        },
        {
            title: 'Loại sân',
            dataIndex: 'id_field_types',
            key: 'id_field_types',
        },
        {
            title: 'Người dùng',
            dataIndex: 'id_users',
            key: 'id_users',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Giá trị',
            dataIndex: 'value',
            key: 'value',
            render: (text, record) => {
                // Định dạng số theo format tiền Việt Nam
                const formattedCost = Number(record.value).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                return formattedCost;
            },
        },
        {
            title: 'Ngày tạo',
            key: 'created_at',
            dataIndex: 'created_at',
            render: (text) => moment(text).format('YYYY-MM-DD'),
        },
        {
            title: 'Phê duyệt',
            dataIndex: 'approval',
            key: 'approval',
            render: (approval) => {
                return approval === 'unapproved' ? 'Chưa phê duyệt' : "Phê duyệt";
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <div>
                    <Row>
                        {userData.role != "isHost" ? (
                            <>
                                <Popconfirm
                                    title="Bạn muốn phê duyệt sân bóng này?"
                                    onConfirm={() => handleUnBanAccount(record)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button
                                        size="small"
                                        icon={<CheckCircleOutlined />}
                                        style={{ width: 170, borderRadius: 15, height: 30 }}
                                    >
                                        {"Phê duyệt"}
                                    </Button>
                                </Popconfirm>
                                <div
                                    style={{ marginTop: 10 }}>
                                    <Popconfirm
                                        title="Bạn muốn từ chối sân bóng này?"
                                        onConfirm={() => handleBanAccount(record)}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button
                                            size="small"
                                            icon={<StopOutlined />}
                                            style={{ width: 170, borderRadius: 15, height: 30 }}
                                        >
                                            {"Không phê duyệt"}
                                        </Button>
                                    </Popconfirm>
                                </div>
                                <Button
                                    size="small"
                                    icon={<EyeOutlined />} // Use EyeOutlined icon for view
                                    style={{ width: 170, borderRadius: 15, height: 30, marginTop: 5 }}

                                    onClick={() => handleViewParticipants(record.id)} // Call handleViewParticipants on click
                                >
                                    {"Xem người tham dự"}
                                </Button>

                            </>
                        ) : (
                            <>
                                <Button
                                    size="small"
                                    icon={<EditOutlined />}
                                    style={{ width: 170, borderRadius: 15, height: 30 }}
                                    onClick={() => handleEditCategory(record.id)}
                                >{"Chỉnh sửa"}
                                </Button>
                                <div
                                    style={{ marginTop: 6 }}>
                                    <Popconfirm
                                        title="Bạn có chắc chắn xóa sân bóng này?"
                                        onConfirm={() => handleDeleteCategory(record.id)}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button
                                            size="small"
                                            icon={<DeleteOutlined />}
                                            style={{ width: 170, borderRadius: 15, height: 30 }}
                                        >{"Xóa"}
                                        </Button>
                                    </Popconfirm>
                                </div>
                                <Button
                                    size="small"
                                    icon={<EyeOutlined />} // Use EyeOutlined icon for view
                                    style={{ width: 170, borderRadius: 15, height: 30, marginTop: 5 }}

                                    onClick={() => handleViewParticipants(record.id)} // Call handleViewParticipants on click
                                >
                                    {"Xem người tham dự"}
                                </Button>
                            </>
                        )}
                    </Row>
                </div>
            ),
        },
    ];

    const history = useHistory();


    const handleViewParticipants = (id) => {
        history.push("/participants/" + id);
    };

    const handleChangeImage = async (e) => {
        setLoading(true);
        const response = await uploadFileApi.uploadFile(e);
        if (response) {
            setUploadFile(response);
        }
        setLoading(false);
    }

    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleFilter2 = async (category_name) => {
        try {
            console.log(category_name);

            if (category_name) {
                await courtsManagementApi.getAllCourts().then((res) => {
                    const filteredByCategoryName = res.data.filter(item => item.category_name
                        .toLowerCase() === category_name.toLowerCase());

                    setCategory(filteredByCategoryName);
                });
            } else {
                await courtsManagementApi.getAllCourts().then((res) => {
                    console.log(res);
                    setCategory(res.data);
                    setLoading(false);
                });
            }


        } catch (error) {
            console.log('search to fetch category list:' + error);
        }
    }

    const [userData, setUserData] = useState([]);


    useEffect(() => {
        (async () => {
            try {

                const response = await userApi.getProfile();
                console.log(response);
                setUserData(response.user);

                const createdById = response.user.id;

                if (response.user.role == "isAdmin") {

                    await courtsManagementApi.getAllCourts().then((res) => {
                        console.log(res);
                        setCategory(res);
                        setLoading(false);
                    });
                } else {
                    await courtsManagementApi.getListByUser(createdById).then((res) => {
                        console.log(res);
                        setCategory(res);
                        setLoading(false);
                    });
                }


                await fieldtypesApi.getAllFieldTypes().then((res) => {
                    console.log(res);
                    setFieldTypes(res);
                    setLoading(false);
                });
                ;
            } catch (error) {
                console.log('Failed to fetch category list:' + error);
            }
        })();
    }, [])
    return (
        <div>
            <Spin spinning={loading}>
                <div className='container'>
                    <div style={{ marginTop: 20 }}>
                        <Breadcrumb>
                            <Breadcrumb.Item href="">
                                <HomeOutlined />
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="">
                                <ShoppingOutlined />
                                <span>Quản lý sân bóng</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <div id="my__event_container__list">
                            <PageHeader
                                subTitle=""
                                style={{ fontSize: 14 }}
                            >
                                <Row>
                                    <Col span="18">
                                        {userData.role == "isAdmin" ?

                                            <Input
                                                placeholder="Tìm kiếm theo tên và mô tả"
                                                allowClear
                                                onChange={handleFilter}
                                                style={{ width: 300 }}
                                            /> : null}
                                    </Col>
                                    <Col span="6">
                                        <Row justify="end">
                                            <Space>
                                                {userData.role == "isAdmin" ?
                                                    <Select
                                                        placeholder="Lọc theo loại sân"
                                                        style={{ width: 260, marginRight: 10 }}
                                                        onChange={(value) => {
                                                            setSelectedCategory(value);
                                                            handleFilter2(value);
                                                        }}
                                                        value={selectedCategory}
                                                    >
                                                        <Option value="">Tất cả loại sân</Option>
                                                        {fieldTypes.map(category => (
                                                            <Option key={category.type} value={category.type}>
                                                                {category.type}
                                                            </Option>
                                                        ))}
                                                    </Select> : null}
                                                <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo sân bóng</Button>
                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>

                            </PageHeader>
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Table columns={columns} pagination={{ position: ['bottomCenter'] }} dataSource={category} />
                    </div>
                </div>

                <Modal
                    title="Tạo sân bóng mới"
                    visible={openModalCreate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form
                            .validateFields()
                            .then((values) => {
                                form.resetFields();
                                handleOkUser(values);
                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }}
                    onCancel={() => handleCancel("create")}
                    okText="Hoàn thành"
                    cancelText="Hủy"
                    width={600}
                >
                    <Form
                        form={form}
                        name="eventCreate"
                        layout="vertical"
                        initialValues={{
                            residence: ['zhejiang', 'hangzhou', 'xihu'],
                            prefix: '86',
                        }}
                        scrollToFirstError
                    >
                        <Spin spinning={loading}>

                            <Form.Item
                                name="name"
                                label="Tên"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tên!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Input placeholder="Tên" />
                            </Form.Item>
                            <Form.Item
                                name="description"
                                label="Mô tả"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập mô tả!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Input placeholder="Mô tả" />
                            </Form.Item>

                            <Form.Item
                                name="value"
                                label="Giá trị"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập giá trị!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <InputNumber
                                    placeholder="Giá trị"
                                    style={{ width: '100%' }}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} // Use dot as a thousand separator
                                    parser={(value) => value.replace(/\./g, '')} // Remove dots for parsing
                                />
                            </Form.Item>

                            <Form.Item
                                name="location"
                                label="Vị trí"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập vị trí!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Input placeholder="Vị trí" />
                            </Form.Item>

                            <Form.Item
                                name="status"
                                label="Trạng thái"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn trạng thái!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Select placeholder="Chọn trạng thái">
                                    <Select.Option value="Đang sử dụng">Đang sử dụng</Select.Option>
                                    <Select.Option value="Chưa sử dụng">Chưa sử dụng</Select.Option>
                                    <Select.Option value="Bản nháp">Bản nháp</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="id_field_types"
                                label="Loại sân"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn loại sân!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Select placeholder="Chọn loại sân">
                                    {fieldTypes.map(fieldType => (
                                        <Option key={fieldType.id} value={fieldType.id}>
                                            {fieldType.type}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="image"
                                label="Chọn ảnh"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn ảnh!',
                                    },
                                ]}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleChangeImage}
                                    id="avatar"
                                    name="file"
                                />
                            </Form.Item>
                        </Spin>
                    </Form>
                </Modal>

                <Modal
                    title="Chỉnh sân bóng"
                    visible={openModalUpdate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form2
                            .validateFields()
                            .then((values) => {
                                form2.resetFields();
                                handleUpdateCategory(values);
                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }}
                    onCancel={handleCancel}
                    okText="Hoàn thành"
                    cancelText="Hủy"
                    width={600}
                >
                    <Form
                        form={form2}
                        name="eventCreate"
                        layout="vertical"
                        initialValues={{
                            residence: ['zhejiang', 'hangzhou', 'xihu'],
                            prefix: '86',
                        }}
                        scrollToFirstError
                    >
                        <Spin spinning={loading}>
                            <Form.Item
                                name="name"
                                label="Tên"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your sender name!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Input placeholder="Tên" />
                            </Form.Item>
                            <Form.Item
                                name="description"
                                label="Mô tả"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your subject!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Input placeholder="Mô tả" />
                            </Form.Item>

                            <Form.Item
                                name="value"
                                label="Giá trị"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập giá trị!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <InputNumber
                                    placeholder="Giá trị"
                                    style={{ width: '100%' }}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} // Use dot as a thousand separator
                                    parser={(value) => value.replace(/\./g, '')} // Remove dots for parsing
                                />
                            </Form.Item>

                            <Form.Item
                                name="location"
                                label="Vị trí"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập vị trí!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Input placeholder="Vị trí" />
                            </Form.Item>

                            <Form.Item
                                name="status"
                                label="Trạng thái"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn trạng thái!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Select placeholder="Chọn trạng thái">
                                    <Select.Option value="Đang sử dụng">Đang sử dụng</Select.Option>
                                    <Select.Option value="Chưa sử dụng">Chưa sử dụng</Select.Option>
                                    <Select.Option value="Bản nháp">Bản nháp</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="id_field_types"
                                label="Loại sân"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn loại sân!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Select placeholder="Chọn loại sân">
                                    {fieldTypes.map(fieldType => (
                                        <Option key={fieldType.id} value={fieldType.id}>
                                            {fieldType.type}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="quantity"
                                label="Số lượng"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập số lượng!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <InputNumber placeholder="Số lượng" disabled />
                            </Form.Item>

                            <Form.Item name="image" label="Ảnh hiện tại">
                                <Input disabled value={form2.getFieldValue('image')} />
                            </Form.Item>

                            <Form.Item
                                name="attachment"
                                label="Chọn ảnh"
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleChangeImage}
                                    id="avatar"
                                    name="file"
                                />
                            </Form.Item>
                        </Spin>
                    </Form>
                </Modal>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default AssetManagement;