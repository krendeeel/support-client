import { Dropdown } from 'antd';
import copy from 'clipboard-copy';

import styles from './Answer.module.css';

export const Answer = ({ text }) => {
  const items = [
    {
      key: '1',
      label: 'Копировать',
      onClick: () => copy(text),
    },
  ];

  return (
    <div className={styles.wrapper}>
      <Dropdown trigger={['contextMenu']} menu={{ items }}>
        <div className={styles.content}>{text}</div>
      </Dropdown>
    </div>
  );
};
