'use client';

import { PropsWithChildren } from 'react';
import { Label, Textarea, TextInput } from 'flowbite-react';
import { Project } from '@/app/types/project';

export const ProjectForm = (
  {
    readonly = false,
    action,
    project,
    children
  }: PropsWithChildren<{
    readonly?: boolean,
    action?: (formData: FormData) => Promise<void> | void,
    project?: Partial<Project> | null
  }>
) => {

  const { name, region, description } = project || {};

  return (
    <form action={action} className="flex flex-col items-center justify-center w-full">
      <div>
        <div className="mb-2 block">
          <Label htmlFor="name">Company</Label>
        </div>
        <TextInput id="name" name="name" required shadow value={name} disabled={readonly}/>
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="region">Country</Label>
        </div>
        <TextInput id="region" name="region" required shadow value={region} disabled={readonly}/>
      </div>
      <div className="max-w-md">
        <div className="mb-2 block">
          <Label htmlFor="description">Description</Label>
        </div>
        <Textarea id="description" name="description" required rows={4} value={description} disabled={readonly}/>
      </div>
      {children}
    </form>
  );
};