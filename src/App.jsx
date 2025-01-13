import isEmpty from 'lodash.isempty';
import { useQuery } from 'react-query';
import { Divider, Typography, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import styles from './App.module.css';
import { withAuth } from './hocs/withAuth.jsx';
import { questionsApi } from './api/questionsApi.js';
import { Question } from './components/Question/Question.jsx';
import { QuestionInput } from './components/QuestionInput/QuestionInput.jsx';

const AppComponent = () => {
  const { data: questions, isLoading } = useQuery({
    queryKey: [questionsApi.key],
    queryFn: questionsApi.fetch,
    refetchOnWindowFocus: false,
    refetchInterval: 60000,
  });

  return (
    <div className={styles.wrapper}>
      <Typography.Title style={{ textAlign: 'center' }}>
        Служба технической поддержки
      </Typography.Title>
      <Divider />
      {isLoading && (
        <div className={styles.loader}>
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </div>
      )}
      {!isLoading && isEmpty(questions) && (
        <div className={styles.empty}>
          <Typography.Title
            type="secondary"
            level={4}
            style={{ maxWidth: 380, textAlign: 'center' }}
          >
            Задайте свой вопрос, и мы постараемся помочь вам как можно быстрее и эффективнее!
          </Typography.Title>
        </div>
      )}
      {!isLoading && !isEmpty(questions) && (
        <div className={styles.list}>
          {questions.map((question) => (
            <Question key={question._id} {...question} />
          ))}
        </div>
      )}
      <Divider />
      <QuestionInput disabled={isLoading} />
    </div>
  );
};

export const App = withAuth(AppComponent);
