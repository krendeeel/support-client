import { useState } from 'react';
import { Button, Input, Space } from 'antd';
import { useMutation, useQueryClient } from 'react-query';
import { SendOutlined, LoadingOutlined } from '@ant-design/icons';

import { questionsApi } from '../../api/questionsApi.js';

export const QuestionInput = ({ disabled }) => {
  const queryClient = useQueryClient();

  const [value, setValue] = useState('');

  const { isLoading, mutate } = useMutation({
    mutationFn: questionsApi.create,
    onMutate: async (newQuestion) => {
      await queryClient.cancelQueries({ queryKey: [questionsApi.key] });

      const previousQuestions = queryClient.getQueryData([questionsApi.key]);

      queryClient.setQueryData([questionsApi.key], (old) => [
        ...old,
        { ...newQuestion, _id: crypto.randomUUID() },
      ]);

      return { previousQuestions };
    },
    onError: (err, newQuestion, context) => {
      queryClient.setQueryData([questionsApi.key], context.previousQuestions);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [questionsApi.key] });
    },
  });

  const disabledSend = disabled || isLoading;

  const createQuestion = () => {
    const text = value.trim();

    if (!text) {
      return;
    }

    void mutate({ text });

    setValue('');
  };

  return (
    <Space.Compact style={{ width: '100%' }}>
      <Input
        size={'large'}
        value={value}
        disabled={disabledSend}
        onPressEnter={createQuestion}
        placeholder={'Введите Ваш вопрос...'}
        onChange={(event) => setValue(event.target.value)}
      />
      <Button
        size={'large'}
        type="primary"
        disabled={disabledSend}
        onClick={createQuestion}
        icon={isLoading ? <LoadingOutlined /> : <SendOutlined />}
      />
    </Space.Compact>
  );
};
