
import { ProTable } from '@ant-design/pro-components';

const DataTable = ({
  columns,
  defaultData = [],
  dataSource,
  postData,
  pagination,
  loading,
  rowKey = (record) => record.id,
  scroll,
  params,
  request,
  search,
  polling,
  toolBarRender,
  headerTitle,
  actionRef,
  dateFormatter = 'string',
  rowSelection,
  expandable
}) => {
  return (
    <ProTable
      columns={columns}
      defaultData={defaultData}
      dataSource={dataSource}
      postData={postData}
      pagination={pagination}
      bordered
      loading={loading}
      rowKey={rowKey}
      scroll={scroll}
      params={params}
      request={request}
      search={search}
      polling={polling}
      toolBarRender={toolBarRender}
      headerTitle={headerTitle}
      actionRef={actionRef}
      dateFormatter={dateFormatter}
      rowSelection={rowSelection}
      expandable={expandable}
    />
  );
};

export default DataTable;
