import { useState } from 'react';
import copy from 'clipboard-copy';
import { Dropdown, Typography } from 'antd';
import { useMutation, useQueryClient } from 'react-query';

import styles from './Question.module.css';
import { Answer } from '../Answer/Answer.jsx';
import { questionsApi } from '../../api/questionsApi.js';

export const Question = ({ _id, text, answer }) => {
  const queryClient = useQueryClient();

  const [editing, setEditing] = useState(false);

  const { mutate: deleteQuestion } = useMutation({
    mutationFn: questionsApi.delete,
    onMutate: async (questionId) => {
      await queryClient.cancelQueries({ queryKey: [questionsApi.key] });

      const previousQuestions = queryClient.getQueryData([questionsApi.key]);

      queryClient.setQueryData([questionsApi.key], (old) =>
        old.filter((question) => question._id !== questionId),
      );

      return { previousQuestions };
    },
    onError: (err, questionId, context) => {
      queryClient.setQueryData([questionsApi.key], context.previousQuestions);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [questionsApi.key] });
    },
  });

  const { mutate: editQuestion } = useMutation({
    mutationFn: questionsApi.edit,
    onMutate: async (updatedQuestion) => {
      await queryClient.cancelQueries({ queryKey: [questionsApi.key] });

      const previousQuestions = queryClient.getQueryData([questionsApi.key]);

      queryClient.setQueryData([questionsApi.key], (old) => {
        return old.map((question) =>
          question._id === updatedQuestion.id
            ? { ...question, text: updatedQuestion.text }
            : question,
        );
      });

      return { previousQuestions };
    },
    onError: (err, newQuestion, context) => {
      queryClient.setQueryData([questionsApi.key], context.previousQuestions);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [questionsApi.key] });
    },
  });

  const items = [
    {
      key: '1',
      label: 'Изменить',
      disabled: !!answer,
      onClick: () => setEditing(true),
    },
    {
      key: '2',
      label: 'Копировать',
      onClick: () => copy(text),
    },
    {
      key: '3',
      label: 'Удалить',
      danger: true,
      onClick: () => deleteQuestion(_id),
    },
  ];

  return (
    <>
      <div className={styles.wrapper}>
        <Dropdown trigger={['contextMenu']} menu={{ items }}>
          <div className={styles.content}>
            <Typography.Text
              className={styles.text}
              editable={{
                editing,
                onChange: (value) => {
                  void editQuestion({ id: _id, text: value });
                  setEditing(false);
                },
              }}
            >
              {text}
            </Typography.Text>
          </div>
        </Dropdown>
      </div>
      {answer && <Answer {...answer} />}
    </>
  );
};
