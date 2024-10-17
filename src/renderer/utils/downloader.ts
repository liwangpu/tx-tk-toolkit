import { message } from 'antd';

export async function downloadFile(props: {
  request: () => Promise<any>,
  fileName: string,
}) {
  const { fileName, request } = props;
  try {
    message.info('开始下载,请稍后!');
    const response = await request();
    const href = URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = href;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  } catch (error) {
    console.error(`下载失败,原因为:`, error);
  }
}

export async function downloadAttachmentFile(props: {
  attachmentId: string
}) {
  // const { attachmentId } = props;
  // try {
  //   const link = document.createElement('a');
  //   link.href = href;
  //   // link.setAttribute('download', fileName);
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  //   // URL.revokeObjectURL(href);
  // } catch (error) {
  //   console.error(`下载失败,原因为:`, error);
  // }
}