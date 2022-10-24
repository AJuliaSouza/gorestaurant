import {
  useEffect,
  useRef,
  useState,
  useCallback
} from 'react';

import { useField } from '@unform/core';

import { Container } from './styles';

interface InputProps {
  name: string;
  icon?: any;
  placeholder: string;
}

export const Input = ({ name, icon: Icon, placeholder }: InputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const { fieldName, defaultValue, registerField } = useField(name);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    setIsFilled(!!inputRef.current?.value);
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <Container isFilled={isFilled} isFocused={isFocused}>
      {Icon && <Icon size={20} />}

      <input
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        ref={inputRef}
        placeholder={placeholder}
        defaultValue={defaultValue}
      />
    </Container>
  );
};
