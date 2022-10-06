import Layout from '../components/layout';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/auth';
import { useForm, SubmitHandler } from 'react-hook-form';
import { createEvent } from '../lib/queries';
import { Inputs } from '../lib/forms.types';

export default function New() {
  const router = useRouter();
  const { session, loading, user } = useAuth();

  if (!user && !loading) router.push('/login');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    formState,
  } = useForm<Inputs>({
    defaultValues: {
      contributions_enabled: true,
      contributions_frozen: false,
      contributions_custom_title_enabled: false,
    },
  });
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    // console.log('Form submission data:', data);
    (async () => {
      const { route, error } = await createEvent({ ...data, host_id: user.id });
      if (error) {
        alert('An error has occured');
        console.error(error);
        router.push('/dashboard');
      } else {
        router.push(route);
      }
    })();
  };

  // if (errors) console.log(errors);
  // console.log('Form State', formState);
  // console.log('contributions_enabled', watch('contributions_enabled'));

  const heading = (
    <div className="py-4">
      <h2 className="mt-6 text-center text-5xl font-bold tracking-tight text-gray-900">🥳</h2>
      <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
        Create A New Event
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">Wooohhh Party!!!</p>
    </div>
  );

  const card = (
    <div className="pt-10 pb-10 sm:my-0">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        {/* Form Heading */}
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Event Information</h3>
            <p className="mt-1 text-sm text-gray-600">
              This information will be visible on your event page. Anyone you share the link with
              can view the page.
            </p>
          </div>
        </div>
        {/* Main Form Body */}
        <div className="mt-5 md:mt-0">
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className="overflow-hidden shadow sm:rounded-md">
              <div className="bg-white px-4 py-5 sm:p-6">
                <div className="grid grid-cols-4 gap-6">
                  {/* input title */}
                  <div className="col-span-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      {...register('title', {
                        required: { value: true, message: 'Required' },
                        maxLength: { value: 60, message: 'Too long' },
                        // pattern: { value: /[A-Za-z]/i, message: 'Must contain a character' }, // this is done by default when field is required
                      })}
                      id="title"
                      placeholder="Your Event Title"
                      autoComplete="off"
                      className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <FormError message={errors.title?.message as string} />
                  </div>

                  {/* input date */}
                  <div className="col-span-4 sm:col-span-2">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <input
                      type="date"
                      {...register('date', {
                        required: { value: true, message: 'Required' },
                      })}
                      id="date"
                      // placeholder=""
                      autoComplete="off"
                      className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <FormError message={errors.date?.message as string} />
                  </div>

                  {/* input time */}
                  <div className="col-span-4 sm:col-span-4">
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                      {'Time (optional)'}
                    </label>
                    <input
                      type="text" // yes, "text" is intentional for the "time" field
                      {...register('time', {
                        maxLength: { value: 60, message: 'Too long' },
                      })}
                      id="time"
                      placeholder="A time, a schedule, anything..."
                      autoComplete="off"
                      className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <FormError message={errors.time?.message as string} />
                  </div>

                  {/* input location */}
                  <div className="col-span-4 ">
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                      {'Location (optional)'}
                    </label>
                    <input
                      type="text"
                      {...register('location', {
                        maxLength: { value: 100, message: 'Too long' },
                      })}
                      id="location"
                      placeholder="A description, an address, anything..."
                      autoComplete="street-address"
                      className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <FormError message={errors.location?.message as string} />
                  </div>

                  {/* input description */}
                  <div className="col-span-4">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="description"
                        {...register('description', {
                          required: { value: true, message: 'Required' },
                          maxLength: { value: 2000, message: 'Too long' },
                        })}
                        rows={3}
                        placeholder="Your event description..."
                        className="form-textarea mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <FormError message={errors.description?.message as string} />
                    <p className="mt-2 text-sm text-gray-500">
                      Brief description of your event. URLs are hyperlinked.
                    </p>
                  </div>

                  {/* input Contributions */}
                  <div className="col-span-full space-y-6 bg-white px-0 py-0 sm:p-6">
                    <fieldset>
                      <legend className="sr-only">Options</legend>
                      <div className="text-base font-medium text-gray-900" aria-hidden="true">
                        Options
                      </div>

                      <div className="mt-4 grid grid-cols-12 space-y-4">
                        {/* input contributions enable */}
                        <div className="col-span-full col-start-1 flex items-start">
                          <div className="flex h-5 items-center">
                            <input
                              // disabled
                              id="contributions_enabled"
                              {...register('contributions_enabled')}
                              type="checkbox"
                              className="toggle"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="contributions_enabled"
                              className="font-medium text-gray-700"
                            >
                              Enable Guest Contributions
                            </label>
                            <p className="text-gray-500">
                              When enabled, a potluck-like feature appears on your event page.
                              Guests can offer to contribute something. As host, you can also
                              request items. Guests do not need an account to make contributions,
                              they simply list their name alongside their contributions.
                            </p>
                          </div>
                        </div>

                        {/* input contributions frozen */}
                        {watch('contributions_enabled') && (
                          <div className="col-span-full col-start-2 flex items-start">
                            <div className="flex h-5 items-center">
                              <input
                                // disabled
                                id="contributions_frozen"
                                {...register('contributions_frozen')}
                                type="checkbox"
                                className="toggle"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label
                                htmlFor="contributions_frozen"
                                className="font-medium text-gray-700"
                              >
                                Freeze Guest Contributions
                              </label>
                              <p className="text-gray-500">
                                When frozen, guests can not contribute new items, but they can still
                                claim items you have requested.
                              </p>
                            </div>
                          </div>
                        )}

                        {/* input contributions custom title enabled */}
                        {watch('contributions_enabled') && (
                          <div className="col-span-full col-start-2 flex items-start">
                            <div className="flex h-5 items-center">
                              <input
                                // disabled
                                id="contributions_custom_title_enabled"
                                {...register('contributions_custom_title_enabled', {})}
                                type="checkbox"
                                className="toggle"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="offers" className="font-medium text-gray-700">
                                Use Custom Title For Contributions Section
                              </label>
                              <p className="text-gray-500">
                                {
                                  'By default, the section is titled "Guest Contributions" on your event page, but you may wish to use a more specific title such as "Dessert Potluck", "Carpool Volunteers", "Karaoke Sign-ups", etc. Get creative!'
                                }
                              </p>
                            </div>
                          </div>
                        )}

                        {/* input contributions custom title */}
                        {watch('contributions_enabled') &&
                          watch('contributions_custom_title_enabled') && (
                            <div className="col-span-full col-start-3">
                              {/* <label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Contributions Custom Title
                          </label> */}
                              <input
                                disabled={!watch('contributions_custom_title_enabled')}
                                type="text"
                                {...register('contributions_custom_title', {
                                  required: {
                                    value: true,
                                    message: 'Enter custom title or turn off the feature',
                                  },
                                  maxLength: { value: 60, message: 'Too long' },
                                })}
                                id="contributions_custom_title"
                                placeholder="Custom Title"
                                autoComplete="off"
                                className="form-input fade-when-disabled mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm "
                              />
                              <FormError
                                message={errors.contributions_custom_title?.message as string}
                              />
                            </div>
                          )}

                        {/* end of contribution options */}
                      </div>
                    </fieldset>
                  </div>

                  {/* input photo */}
                  <div className="col-span-full">
                    <label className="block text-sm font-medium text-gray-700">Cover Photo</label>
                    <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  </div>

                  {/* end of inputs */}
                </div>
              </div>
              {/* submit button */}
              <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Create
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      {heading}
      {card}
    </Layout>
  );
}

function FormError({ message }: { message: string | undefined | null }) {
  if (message) {
    return (
      <div className="text-error px-1 pt-1 text-sm font-semibold">
        {/* {errors.email?.message as string} */}
        {message}
      </div>
    );
  }
  return <></>;
}
