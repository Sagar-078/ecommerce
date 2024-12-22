import { RootState } from '@/redux/store/store';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

const Emailinfo = ({updateProfile}:any) => {

    const [editmode, setEditmode] = useState(false);
    const {register, handleSubmit, setValue, formState:{errors}} = useForm();
    const {user} = useSelector((state: RootState) => state.authUser);
    const {token} = useSelector((state:any) => state.authToken);

    async function submitHandler(data:any){
        console.log("data of email " , data);
        updateProfile(data);
    }

    useEffect(() => {
        setValue("email", user.email);
    }, []);

  return (
    <div className='flex flex-col gap-7'>
        <div className='flex gap-6 '>
            <h1 className=" font-bold text-lg">Email Address</h1>
            {
                !editmode ? 
                    (<button className=" text-sm font-semibold text-blue-600" onClick={() => setEditmode(true)}>Edit</button>) 
                    : 
                    (<button className=" text-sm font-semibold text-blue-600" onClick={() => setEditmode(false)}>Cancel</button>)
            }
        </div>

        <div className=' flex gap-5'>
            <div>
                <input type="text" placeholder="Enter your email" readOnly={!editmode} className=" outline-none border border-gray-200 p-3 w-[270px] rounded-md text-gray-500"
                    {
                        ...register("email", {
                            required: true
                        })
                    }
                />
                {
                    errors.firstName && <p>First Name is required</p>
                }
            </div>
            {
                editmode && (
                    <button onClick={handleSubmit(submitHandler)} className=" bg-blue-600 px-6 rounded-md text-white">
                        SAVE
                    </button>
                )
            }
        </div>
    </div>
  )
}

export default Emailinfo