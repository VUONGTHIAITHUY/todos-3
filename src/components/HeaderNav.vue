<template>
        <div class="flex uppercase justify-between items-center border-b-4 border-black">
            <div class="p-8 border-r-4 border-black font-bold text-2xl">VUONG THI AI THUY</div>
            <div>
                <h1 class="font-bold text-2xl">Todo list</h1>
            </div>
            <div>
                <LocaleSwitcher />
            </div>
        </div>
</template>

<script>
import LocaleSwitcher from '@/components/LocaleSwitcher'

export default {
    components: {
        LocaleSwitcher
    }
}
</script>