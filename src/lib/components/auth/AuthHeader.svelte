<script>
    import { SVG } from '$lib/utils/svgs';
    import student1 from '../../utils/images/millennial-man.png';
	import student2 from '../../utils/images/curly-latin-female.png';

</script>

<header class="relative px-[1rem] pt-[10px]">
    <div class="w-full lg:grid lg:grid-cols-3">
        <div class="border-black-500 col-span-2 border">
            <div class="flex w-full flex-col justify-center xs:p-[10px] sm:p-[30px] lg:py-[60px]">
                <div class="mb-[7px] flex w-full items-center gap-[2rem] sm:gap-[3rem] lg:gap-[4rem]">
                    <h1 class="font-semibold text-[#022F49]">Let's begin your</h1>

                    <span class="relative mr-[6px]">
                        {@html SVG.zigmeLogo}
                        {@html SVG.zigmeBackground}
                    </span>
                </div>

                <div class="flex justify-end">
                    <h1 class="font-semibold text-[#022F49]">Journey to Success !</h1>
                </div>
            </div>
        </div>

        <div class="relative col-span-1 flex h-full w-full justify-between">
            <div class="h-[115px] lg:py-[60px]">
                <h2 class="flex w-fit items-center rounded-[50px] bg-[#D6DDE2] px-[20px] py-[10px]">
                    <span class="text-[1rem] font-[600] text-[#F28212] lg:text-[18px]">#Zig</span>
                    <span class="text-[1rem] font-[600] lg:text-[18px]">ItUP</span>
                </h2>
            </div>

            <div class="">
                <div class="absolute right-[58px] top-0 sm:right-[76px] sm:top-[-20px] lg:right-[138px] lg:top-[95px]">
                    {@html SVG.roundedLogo1}
                    {@html SVG.roundedLogo2}
                </div>

                <img
                    class="absolute bottom-0 right-[105px] right-[86px] z-20 h-[115px] w-[173px] sm:h-[150px] sm:w-[254px] lg:right-[175px] lg:h-[169px]"
                    src={student1}
                    alt="Student"
                />

                <img
                    class="absolute right-[-25px] top-[21px] h-[115px] sm:right-[-38px] sm:top-[-4px] sm:h-[140px] lg:right-[30px] lg:top-[138px] lg:h-[153px]"
                    src={student2}
                    alt="Student"
                />
            </div>
        </div>
    </div>
</header> 