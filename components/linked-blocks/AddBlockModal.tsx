/**

Copyright 2019 Forestry.io Inc

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

import * as React from "react";
import styled, { css } from "styled-components";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalActions,
  ModalPopup,
} from "@tinacms/react-modals";
import { FormBuilder, FieldsBuilder } from "@tinacms/form-builder";
import { useMemo } from "react";
import { Form } from "@tinacms/forms";
import { Button } from "@tinacms/styles";
import { useCMS } from "@tinacms/react-core";
import { FormView } from "@tinacms/react-forms";

export const AddBlockModal = ({ plugin, close }: any) => {
  const cms = useCMS();

  const form: Form = useMemo(
    () =>
      new Form({
        label: "create-form",
        id: "create-form-id",
        actions: [],
        fields: plugin.fields,
        onSubmit(values) {
          plugin.onSubmit(values, cms).then(() => {
            close();
          });
        },
      }),
    [close, cms, plugin]
  );
  return (
    <Modal>
      <ModalPopup>
        <ModalHeader close={close}>{plugin.name}</ModalHeader>
        <ModalBody>
          <FormView activeForm={form} />
          {/* <FieldsBuilder form={form} fields={form.fields} /> */}
        </ModalBody>
      </ModalPopup>
    </Modal>
  );
};

const CreateButton = styled.button`
  position: relative;
  text-align: center;
  font-size: var(--tina-font-size-0);
  padding: 0 12px;
  height: 40px;
  font-weight: 500;
  width: 100%;
  background: none;
  cursor: pointer;
  outline: none;
  border: 0;
  transition: all 85ms ease-out;
  &:hover {
    color: var(--tina-color-primary);
    background-color: #f6f6f9;
  }
  &:not(:last-child) {
    border-bottom: 1px solid #efefef;
  }
`;
