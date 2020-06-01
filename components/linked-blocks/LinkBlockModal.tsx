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
import { mapLocalizedValues } from "../../lib/mapLocalizedValues";

export const LinkBlockModal = ({ onSubmit, close }: any) => {
  const cms = useCMS();
  const form: Form = useMemo(
    () =>
      new Form({
        label: "link-form",
        id: "link-form-id",
        actions: [],
        fields: [
          /*  TODO - Make this a select field */
          {
            label: "Block ID",
            name: "id",
            description: "Enter the block id, in which you would like to link",
            component: "text",
          },
        ],
        onSubmit(values) {
          const dummyVals = {
            sys: {
              contentType: {
                sys: {
                  id: "banner", //TODO remove this hardcoded type
                  type: "Link",
                  linkType: "Entry",
                },
              },
              id: values.id,
            },
            fields: [],
          };

          onSubmit(dummyVals, cms);
          close();
        },
      }),
    [close, cms, onSubmit]
  );
  return (
    <Modal>
      <FormBuilder form={form}>
        {({ handleSubmit }) => {
          return (
            <ModalPopup>
              <ModalHeader close={close}>Link block</ModalHeader>
              <ModalBody
                onKeyPress={(e) =>
                  e.charCode === 13 ? (handleSubmit() as any) : null
                }
              >
                <FieldsBuilder form={form} fields={form.fields} />
              </ModalBody>
              <ModalActions>
                <Button onClick={close}>Cancel</Button>
                <Button onClick={handleSubmit as any} primary>
                  Add
                </Button>
              </ModalActions>
            </ModalPopup>
          );
        }}
      </FormBuilder>
    </Modal>
  );
};

const ContentMenuWrapper = styled.div`
  position: relative;
  grid-area: actions;
  justify-self: end;
`;

const ContentMenu = styled.div<{ open: boolean }>`
  min-width: 192px;
  border-radius: var(--tina-radius-big);
  border: 1px solid var(--tina-color-grey-2);
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  transform: translate3d(0, 0, 0) scale3d(0.5, 0.5, 1);
  opacity: 0;
  pointer-events: none;
  transition: all 150ms ease-out;
  transform-origin: 100% 0;
  box-shadow: var(--tina-shadow-big);
  background-color: white;
  overflow: hidden;
  z-index: var(--tina-z-index-1);

  ${(props) =>
    props.open &&
    css`
      opacity: 1;
      pointer-events: all;
      transform: translate3d(0, 44px, 0) scale3d(1, 1, 1);
    `};
`;

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
