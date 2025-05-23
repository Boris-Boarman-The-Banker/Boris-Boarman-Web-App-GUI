import { Button, Checkbox, Label, TextInput } from 'flowbite-react';

const AuthLogin = () => {
  return (
    <>
      <form>
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="Username" value="Username"/>
          </div>
          <TextInput
            disabled
            id="username"
            type="text"
            sizing="md"
            className="form-control"
          />
        </div>
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="userpwd" value="Password"/>
          </div>
          <TextInput
            disabled
            id="userpwd"
            type="password"
            sizing="md"
            className="form-control"
          />
        </div>
        <div className="flex justify-between my-5">
          <div className="flex items-center gap-2">
            <Checkbox id="accept" className="checkbox" disabled/>
            <Label
              htmlFor="accept"
              className="opacity-90 font-normal cursor-pointer"
            >
              Remeber this Device
            </Label>
          </div>
          {/*<Link href={'/'} className="text-primary text-sm font-medium">*/}
          {/*  Forgot Password ?*/}
          {/*</Link>*/}
        </div>
        <Button color={'primary'} className="w-full" disabled>
          Sign in
        </Button>
      </form>
    </>
  );
};

export default AuthLogin;
