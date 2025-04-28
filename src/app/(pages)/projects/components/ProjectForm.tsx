'use client';

import React, { PropsWithChildren } from 'react';
import { HelperText, Label, Select, Textarea, TextInput } from 'flowbite-react';
import { Project } from '@/app/types/project';
import { countries } from '@/lib/contants';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { projectValidationSchema } from './projectValidationSchema';

export const ProjectForm = (
  {
    readonly = false,
    action = () => {
    },
    project,
    children,
    title
  }: PropsWithChildren<{
    readonly?: boolean,
    action?: (formData: Partial<Project>) => void,
    project?: Partial<Project> | null;
    title?: string
  }>
) => {
  const { register, formState: { errors }, handleSubmit } = useForm({
    defaultValues: {
      name: project?.name || '',
      region: project?.region || '',
      description: project?.description || ''
    },
    resolver: yupResolver(projectValidationSchema)
  });

  return (
    <div className="relative overflow-hidden bg-muted dark:bg-dark w-full p-4">
      <div className="flex flex-col md:h-[550px] justify-center items-center px-4">
        <div
          className="rounded-lg dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words md:w-[600px] md:h-[550px] border-none ">
          {title && <div className="border-b border-ld px-6 py-4"><h5 className="card-title">{title}</h5></div>}
          <div className="flex h-full justify-center gap-2 p-0 w-full">
            <form onSubmit={handleSubmit(action)} className="flex flex-col items-center justify-center w-full gap-3">
              <div className="w-full">
                <div className="grid grid-cols-12 items-start pb-6">
                  <div className="col-span-2">
                    <Label htmlFor="name" color={errors?.name?.message ? 'failure' : 'default'}>Company</Label>
                  </div>
                  <div className="form-control col-span-10 flex flex-col gap-1">
                    <TextInput
                      id="name"
                      {...register('name')}
                      sizing="md"
                      disabled={readonly}
                      className="form-control"
                      color={errors?.name?.message ? 'failure' : 'gray'}
                    />
                    {errors?.name?.message &&
                        <HelperText color="failure">{errors?.name?.message}</HelperText>
                    }
                  </div>
                </div>
                <div className="grid grid-cols-12 items-start pb-6">
                  <div className="col-span-2">
                    <Label htmlFor="region" color={errors?.region?.message ? 'failure' : 'default'}>Country</Label>
                  </div>
                  <div className="form-control col-span-10 flex flex-col gap-1">
                    <Select
                      id="region"
                      {...register('region')}
                      disabled={readonly}
                      sizing="md"
                      className="form-control"
                      color={errors?.region?.message ? 'failure' : 'gray'}
                      style={{ backgroundColor: 'transparent' }}
                    >
                      <>
                        <option value="" key="null" disabled>Select Country</option>
                        {countries.map(({ name, code }) => (
                          <option value={code} key={code}>{name}</option>
                        ))}
                      </>
                    </Select>
                    {errors?.region?.message &&
                        <HelperText color="failure">{errors?.region?.message}</HelperText>
                    }
                  </div>
                </div>
                <div className="grid grid-cols-12 items-start pb-6">
                  <div className="col-span-2">
                    <Label htmlFor="description"
                           color={errors?.description?.message ? 'failure' : 'default'}>Description</Label>
                  </div>
                  <div className="col-span-10 flex flex-col gap-1">
                    <Textarea
                      id="description"
                      rows={4}
                      {...register('description')}
                      disabled={readonly}
                      className="form-control"
                      style={{ backgroundColor: 'transparent' }}
                      color={errors?.description?.message ? 'failure' : 'gray'}
                    />
                    {errors?.description?.message &&
                        <HelperText color="failure">{errors?.description?.message}</HelperText>
                    }
                  </div>
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