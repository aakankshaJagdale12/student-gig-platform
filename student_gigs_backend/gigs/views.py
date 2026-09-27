from django.shortcuts import render,redirect
from .models import Job


def job_list(request):
    if request.method == "POST":
        title = request.POST.get("title")
        description = request.POST.get("description")
        location = request.POST.get("location")
        date = request.POST.get("date")
        time = request.POST.get("time")
        students = request.POST.get("students")
        payment = request.POST.get("payment")

        print(title)
        print(description)
        print(location)
        print(date)
        print(time)
        print(students)
        print(payment)

        job = Job(
            title=title,
            description=description,
            location=location,
            date=date,
            time=time,
            students=students,
            payment=payment
        )

        job.save()
        return redirect("job_list") 
            
        
    jobs = Job.objects.all()

    print(jobs)

    return render(request, "jobs.html", {"jobs": jobs})