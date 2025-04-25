'use client';

import React, { PropsWithChildren } from 'react';
import { Label, Select, Textarea, TextInput } from 'flowbite-react';
import { Project } from '@/app/types/project';
import { countries } from '@/lib/contants';

export const ProjectForm = (
  {
    readonly = false,
    action,
    project,
    children,
    title
  }: PropsWithChildren<{
    readonly?: boolean,
    action?: (formData: FormData) => Promise<void> | void,
    project?: Partial<Project> | null;
    title?: string
  }>
) => {

  const { name, region, description } = project || {};

  return (
    <div className="relative overflow-hidden bg-muted dark:bg-dark w-full p-4">
      <div className="flex flex-col md:h-[500px] justify-center items-center px-4">
        <div
          className="rounded-lg dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words md:w-[600px] md:h-[500px] border-none ">
          {title && <div className="border-b border-ld px-6 py-4"><h5 className="card-title">{title}</h5></div>}
          <div className="flex h-full justify-center gap-2 p-0 w-full">
            <form action={action} className="flex flex-col items-center justify-center w-full gap-3">
              <div className="w-full">
                <div className="grid grid-cols-12 items-center pb-6">
                  <div className="col-span-2">
                    <Label htmlFor="name">Company</Label>
                  </div>
                  <TextInput
                    id="name"
                    name="name"
                    required
                    value={name}
                    sizing="md"
                    className="form-control col-span-10"
                    disabled={readonly}
                  />
                </div>
                <div className="grid grid-cols-12 items-center pb-6">
                  <div className="col-span-2">
                    <Label htmlFor="region">Country</Label>
                  </div>
                  <Select
                    id="region"
                    name="region"
                    required
                    value={region}
                    disabled={readonly}
                    sizing="md"
                    className="form-control col-span-10"
                  >
                    {countries.map(({ name, code }) => (
                      <option value={code} key={code}>{name}</option>
                    ))}
                  </Select>
                </div>
                <div className="grid grid-cols-12 items-center pb-6">
                  <div className="col-span-2">
                    <Label htmlFor="description">Description</Label>
                  </div>
                  <Textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    value={description}
                    disabled={readonly}
                    className="form-control col-span-10"
                    style={{ backgroundColor: 'transparent' }}
                  />
                </div>
              </div>
              <div className="w-full">
                {children}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};