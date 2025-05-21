import { useState, useEffect, useContext } from "react";
import { Table, Button, Drawer, Form, Input, Modal } from "antd";
import { DeleteOutlined, EditFilled, PlusOutlined } from "@ant-design/icons";
import { useGetEspecialities } from "../../hooks/especialitiesHook";
import { NotificationContext } from "../../contexts/NotificationContext";
import axios from "axios";

const Especialities = () => {
    const { api } = useContext(NotificationContext);
    const { data: especialidades, refetch, isError } = useGetEspecialities();
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (isError) {
            api.error({
                message: "Aviso:",
                description: "Erro ao buscar registros",
            });
        }
    }, [isError]);

    const handleCreate = async (values) => {
        try {
            await axios.post("/especialidade", values);
            api.success({
                message: "Sucesso",
                description: "Especialidade criada com sucesso!",
            });
            setDrawerVisible(false);
            form.resetFields();
            refetch();
        } catch (error) {
            api.error({
                message: "Erro",
                description: "Erro ao criar especialidade.",
            });
        }
    };

    const handleDelete = (id) => {
        Modal.confirm({
            title: "Confirmar exclusão",
            content: "Você tem certeza que deseja excluir esta especialidade?",
            okText: "Sim",
            cancelText: "Não",
            onOk: async () => {
                try {
                    await axios.delete(`/especialidade/${id}`);
                    api.success({
                        message: "Sucesso",
                        description: "Especialidade excluída com sucesso!",
                    });
                    refetch();
                } catch (error) {
                    api.error({
                        message: "Erro",
                        description: "Erro ao excluir especialidade.",
                    });
                }
            }
        });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">Especialidades</h1>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setDrawerVisible(true)}
                >
                    Nova Especialidade
                </Button>
            </div>

            <Table
                dataSource={especialidades}
                rowKey={"especialidade_id"}
                className="w-full border"
            >
                <Table.Column
                    key="especialidade_id"
                    dataIndex="especialidade_id"
                    title="ID"
                />
                <Table.Column
                    key="especialidade_nome"
                    dataIndex="especialidade_nome"
                    title="Nome"
                />
                <Table.Column
                    title="Ações"
                    render={(_, record) => (
                        <div className="flex gap-3">
                            <Button
                                type="primary"
                                icon={<EditFilled />}
                                shape="circle"
                                onClick={() => console.log("Editar:", record)}
                            />
                            <Button
                                type="primary"
                                danger
                                icon={<DeleteOutlined />}
                                shape="circle"
                                onClick={() => handleDelete(record.especialidade_id)}
                            />
                        </div>
                    )}
                />
            </Table>

            <Drawer
                title="Nova Especialidade"
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
                width={400}
            >
                <Form layout="vertical" form={form} onFinish={handleCreate}>
                    <Form.Item
                        label="Nome do Médico"
                        name="nome_medico"
                        rules={[{ required: true, message: "Informe o nome do médico" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: "Informe o email" }]}
                    >
                        <Input type="email" />
                    </Form.Item>

                    <Form.Item
                        label="Telefone"
                        name="telefone"
                        rules={[{ required: true, message: "Informe o telefone" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Especialidade"
                        name="especialidade_nome"
                        rules={[{ required: true, message: "Informe a especialidade" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Criar
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
};

export default Especialities;